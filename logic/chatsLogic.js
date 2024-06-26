import { useEffect, useState } from 'react'
import { useAuth } from './authContext'
import { collection, doc, getDoc, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { blurhash, getChatId, formatDate } from './commonLogic';
import { useSettings } from '../logic/settingsContext';
import translations from '../assets/styles/Translations';

const chatsLogic = (navigation) => {
    const { user } = useAuth();
    const { language, darkMode, profanityFilter, textSize } = useSettings();
    const [friends, setFriends] = useState([]);
    const [lastMessage, setLastMessage] = useState(undefined);
    const [lastMessages, setLastMessages] = useState({});
    const t = (key) => translations[key][language] || translations[key]['English'];

    useEffect(() => {
        //console.log("ChatsLogic use effect started");
        if (user?.uid) {
            //console.log("ChatsLogic use effect if statement passed");
            getFriends();
        }
    }, [user?.uid])


    useEffect(() => {
        friends.forEach(friend => {
            let chatId = getChatId(user?.uid, friend.uid);
            const docRef = doc(db, "chatInds", chatId);
            const messagesRef = collection(docRef, "messages");
            const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
    
            const unsub = onSnapshot(q, (snapshot) => {
                const lastMessage = snapshot.docs.map(doc => doc.data())[0];
                if (lastMessage) {
                    setLastMessages(prev => ({ ...prev, [friend.id]: lastMessage }));
                }
            });
    
            return () => unsub();
        });
    }, [friends, user?.uid]);


    const getFriends = () => {
        const friendsRef = collection(db, 'users', user.uid, 'friends');

        onSnapshot(friendsRef, async (friendsSnapshot) => {
            let friendPromises = friendsSnapshot.docs.map(docSnap => {
                const friendUid = docSnap.id;
                return getDoc(doc(db, 'users', friendUid));
            });

            const friendDocs = await Promise.all(friendPromises);
            const friendsData = friendDocs.filter(docSnap => docSnap.exists()).map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            }));

            setFriends(friendsData); // Update the friends state
        });
    };

    const openChat = (item) => {
        navigation.navigate(t("Messages"), { item });
    }

    const renderTime = (friendId) => {
        const lastMessage = lastMessages[friendId];
        if (lastMessage) {
            let date = lastMessage.createdAt;
            return formatDate(new Date(date.seconds * 1000));
        }
    };

    const renderLastMessage = (friendId) => {
        const lastMessage = lastMessages[friendId];
        if (!lastMessage) return (t("Say Hi") + ' 👋');
    
        const messageText = user?.uid === lastMessage.uid ? (t("You") + `: ${lastMessage.text}`) : lastMessage.text;
    
        return messageText.length > 30 ? `${messageText.slice(0, 30)}...` : messageText;
    };

    //console.log( 'chatsLogic User: ', user, '\n' );
    //console.log( 'chatsLogic Friends: ', friends, '\n' );
    //console.log( 'Last Message: ', lastMessage, '\n' );
    return { user, friends, renderLastMessage, renderTime, openChat, blurhash, getChatId };
}

export default chatsLogic;

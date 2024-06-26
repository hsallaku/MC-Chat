import { useEffect, useState } from 'react';
import { collection, doc, getDocs, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './authContext';

const directoryLogic = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchFriends();
        fetchFriendRequests();
    }, [user, friends, sentRequests]);

    const fetchUserData = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid)); // Fetch the document
            if (userDoc.exists()) { // Check if the document exists
                const userData = userDoc.data(); // Get the data
                return { uid, ...userData }; // Return all user fields, along with the UID
            } else {
                console.warn(`No user found with UID: ${uid}`);
                return null; // If no document, return null or handle it as needed
            }
        } catch (error) {
            console.error("Error fetching user data:", error); // Log the error
            return null; // Return null in case of error
        }
    };


    const fetchUsers = async () => {
        try {
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersRef);
            const userData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).filter((userData) => userData.id !== user.uid);
            setUsers(userData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchFriends = async () => {
        try {
            const friendsRef = collection(db, 'users', user.uid, 'friends');
            const friendsSnapshot = await getDocs(friendsRef);
            const friendIds = friendsSnapshot.docs.map(doc => doc.id);
            setFriends(friendIds);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchFriendRequests = async () => {
        try {
            // Get the collection of friend requests
            const requestsRef = collection(db, 'users', user.uid, 'friendsReceived');
            const requestsSnapshot = await getDocs(requestsRef);

            // Fetch full user data for each request
            const friendRequests = await Promise.all(
                requestsSnapshot.docs.map(async (doc) => {
                    const friendId = doc.id;
                    const friendData = await fetchUserData(friendId); // Fetch complete user data
                    
                    return {
                        id: friendId,
                        senderEmail: friendData.email,
                        ...friendData, // Include all user data, not just the email
                    };
                })
            );
    
            setFriendRequests(friendRequests); // Set the updated friend requests
        } catch (error) {
            console.error("Error fetching friend requests:", error); // Error handling
        }
    };

    const sendFriendRequest = async (friendId) => {
        try {
            const currentUserFriendsSentRef = collection(db, 'users', user.uid, 'friendsSent');
            await setDoc(doc(currentUserFriendsSentRef, friendId), { uid: friendId });

            const recipientFriendsReceivedRef = collection(db, 'users', friendId, 'friendsReceived');
            await setDoc(doc(recipientFriendsReceivedRef, user.uid), { uid: user.uid });

            setSentRequests(prevState => [...prevState, friendId]);

            console.log('Friend request sent successfully.');
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const isFriend = (userId) => {
        return friends.includes(userId);
    };

    const acceptFriendRequest = async (friendId) => {
        try {
            // Add friend to current user's 'friends' collection
            const currentUserFriendsRef = collection(db, 'users', user.uid, 'friends');
            await setDoc(doc(currentUserFriendsRef, friendId), { uid: friendId });

            // Add current user to friend's 'friends' collection
            const friendUserFriendsRef = collection(db, 'users', friendId, 'friends');
            await setDoc(doc(friendUserFriendsRef, user.uid), { uid: user.uid });

            // Remove friend request from 'friendsReceived'
            const currentUserFriendsReceivedRef = collection(db, 'users', user.uid, 'friendsReceived');
            await deleteDoc(doc(currentUserFriendsReceivedRef, friendId));

            // Remove friend request from 'friendsSent' in the friend's account
            const friendFriendsSentRef = collection(db, 'users', friendId, 'friendsSent');
            await deleteDoc(doc(friendFriendsSentRef, user.uid));

            console.log('Friend request accepted successfully.');

            // Refresh the friend requests after acceptance
            await fetchFriendRequests();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const rejectFriendRequest = async (friendId) => {
        try {
            // Remove from current user's 'friendsReceived'
            const currentUserRequestDoc = doc(db, 'users', user.uid, 'friendsReceived', friendId);
            await deleteDoc(currentUserRequestDoc);

            // Remove from sender's 'friendsSent'
            const senderRequestDoc = doc(db, 'users', friendId, 'friendsSent', user.uid);
            await deleteDoc(senderRequestDoc);

            console.log("Friend request rejected successfully.");

            // Refresh friend requests
            fetchFriendRequests();
        } catch (error) {
            console.error("Error rejecting friend request:", error);
        }
    };

    const getOrganizedUsers = () => {
        const friendsList = users.filter((u) => friends.includes(u.id));
        const otherUsersList = users.filter((u) => !friends.includes(u.id));

        return { friendsList, otherUsersList };
    };

    const removeFriend = async (friendId) => {
        try {
            // Remove from the current user's 'friends' collection
            const currentUserFriendsRef = doc(db, 'users', user.uid, 'friends', friendId);
            await deleteDoc(currentUserFriendsRef);

            // Remove from the friend's 'friends' collection
            const friendUserFriendsRef = doc(db, 'users', friendId, 'friends', user.uid);
            await deleteDoc(friendUserFriendsRef);

            // Update the friends list in the state
            setFriends((prev) => prev.filter((id) => id !== friendId));

            console.log('Friend removed successfully.');
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    return {
        users,
        friends,
        isFriend,
        sendFriendRequest,
        sentRequests,
        friendRequests,
        removeFriend,
        fetchFriendRequests,
        acceptFriendRequest,
        rejectFriendRequest,
        getOrganizedUsers,
    };
};

export default directoryLogic;

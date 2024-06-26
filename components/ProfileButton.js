import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../logic/authContext';
import { defaultProfilePicture } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import MenuItem from './MenuItem';
import NotificationBubble from './NotificationBubble';
import translations from '../assets/styles/Translations';
import { getldStyles } from '../assets/styles/LightDarkStyles';

const ProfileButton = () => {
  const { language, darkMode, textSize } = useSettings();
  const { user, logout, pendingFriendRequests, pendingRoomInvites } = useAuth();
  const navigation = useNavigation();
  const hasPendingRequests = pendingFriendRequests && pendingFriendRequests.length > 0;
  const hasPendingInvites = pendingRoomInvites && pendingRoomInvites.length > 0;
  const totalNotifications = (hasPendingRequests ? pendingFriendRequests.length : 0) + (hasPendingInvites ? pendingRoomInvites.length : 0);
  const hasNotifications = hasPendingRequests || hasPendingInvites;
  const t = (key) => translations[key][language] || translations[key]['English'];
  const ldStyles = getldStyles(textSize);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <TouchableOpacity>
      <View style={ldStyles.menuContainer}>
        <Menu>
        <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity, triggerTouchable: { activeOpacity: 1, underlayColor: 'transparent' } }}>
            <Image
              style={ldStyles.profileImageSmall}
              source={{ uri: user?.photoURL || defaultProfilePicture }}
            />
            {hasNotifications && (
              <View style={ldStyles.notificationBubble2}>
                <Text style={ldStyles.notificationText}>{totalNotifications}</Text>
              </View>
            )}
          </MenuTrigger>
          <MenuOptions customStyles={{ optionsContainer: darkMode ? ldStyles.menuOptionsStyleD : ldStyles.menuOptionsStyleL }}>
            <MenuItem
              text={t("Profile")}
              action={() => navigation.navigate('ProfileStack')}
              value={null}
              icon={<Ionicons name="person-outline" size={hp(2.5)} color="gray" />}
            />
            {hasPendingRequests && (
              <MenuItem
                text={t("Friend Requests")}
                action={() => navigation.navigate('FriendRequestsStack')}
                value={null}
                customContent={
                  <NotificationBubble count={pendingFriendRequests.length} />
                }
              />
            )}
            {hasPendingInvites && (
              <MenuItem
                text={t("Room Invites")}
                action={() => navigation.navigate('RoomInvitesStack')}
                value={null}
                customContent={
                  <NotificationBubble count={pendingRoomInvites.length} />
                }
              />
            )}
            <MenuItem
              text={t("Log Out")}
              action={handleLogout}
              value={null}
              icon={<Ionicons name="log-out-outline" size={hp(2.5)} color="gray" />}
            />
          </MenuOptions>
        </Menu>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileButton;

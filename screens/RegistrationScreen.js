import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../logic/authContext';
import { useSettings } from '../logic/settingsContext';
import translations from '../assets/styles/Translations';
import styles from '../assets/styles/AppStyles';
import { getldStyles } from '../assets/styles/LightDarkStyles';

function RegistrationScreen() {
  const { language, darkMode, profanityFilter, textSize } = useSettings();
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();
  const t = (key) => translations[key][language] || translations[key]['English'];
  const ldStyles = getldStyles(textSize);

  const handleRegister = async () => {
    if (!firstName || !lastName || !emailPrefix || !password || !confirmPassword) {
        Alert.alert('Registration Error', "Please fill all the fields!");
        return;
    }

    if (emailPrefix.includes('@') || !/^[a-zA-Z0-9_.-]+$/.test(emailPrefix)) {
        Alert.alert('Invalid Email', "Please enter only the first part of your email before '@manhattan.edu'.");
        return;
    }

    if (password !== confirmPassword) {
        Alert.alert('Password Error', "Passwords don't match. Please try again.");
        return;
    }

    const email = `${emailPrefix}@manhattan.edu`;

    try {
        const result = await register(email, firstName, lastName, password);
        if (!result.success) {
          Alert.alert('Registration Error', result.msg);
        }
    } catch (error) {
        Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
    style={darkMode ? ldStyles.screenD : ldStyles.screenL}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
            <View style={styles.centered}>
            <Image style={styles.logo} resizeMode='contain' source={darkMode ? require('../assets/MCChat_Dark_512px.png') : require('../assets/MCChat_Color_512px.png')} />
            </View>

            <Text style={[darkMode ? ldStyles.headerTextD : ldStyles.headerTextL]}>{t("Sign Up")}</Text>

            {/* First Name */}
            <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L]}>
                <Octicons name="person" size={hp(2.7)} color="gray" />
                <TextInput
                onChangeText={setFirstName}
                style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL]}
                placeholder={t("First Name")}
                placeholderTextColor={'gray'}
                keyboardAppearance={darkMode ? 'dark' : 'light'}
                />
            </View>

            {/* Last Name */}
            <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L]}>
                <Octicons name="person" size={hp(2.7)} color="gray" />
                <TextInput
                onChangeText={setLastName}
                style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL]}
                placeholder={t("Last Name")}
                placeholderTextColor={'gray'}
                keyboardAppearance={darkMode ? 'dark' : 'light'}
                />
            </View>

            {/* Email */}
            <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L]}>
                <Octicons name="mail" size={hp(2.7)} color="gray" />
                <TextInput
                onChangeText={setEmailPrefix}
                style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL]}
                placeholder={t("Email Address")}
                placeholderTextColor={'gray'}
                autoCapitalize="none"
                keyboardAppearance={darkMode ? 'dark' : 'light'}
                />
                <Text style={styles.emailDomain}>@manhattan.edu</Text>
            </View>

            {/* Password */}
            <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L]}>
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                onChangeText={setPassword}
                style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL]}
                placeholder={t("Password")}
                secureTextEntry
                placeholderTextColor={'gray'}
                textContentType="oneTimeCode"
                keyboardAppearance={darkMode ? 'dark' : 'light'}
                />
            </View>

            {/* Confirm Password */}
            <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L]}>
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                onChangeText={setConfirmPassword}
                style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL]}
                placeholder={t("Confirm Password")}
                secureTextEntry
                placeholderTextColor={'gray'}
                textContentType="oneTimeCode"
                />
            </View>

            <TouchableOpacity onPress={handleRegister} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>{t("Sign Up")}</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>{t("Already have an account")}? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.registerLink}>{t("Sign In")}</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

  );
}

export default RegistrationScreen;

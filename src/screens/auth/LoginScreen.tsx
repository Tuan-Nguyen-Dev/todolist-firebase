import {CloseCircle, Lock, PasswordCheck, Sms} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import Container from '../../components/Container';
import TitleComponent from '../../components/TitleComponent';
import {globalStyles} from '../../styles/globalStyles';
import auth from '@react-native-firebase/auth';
import TextComponent from '../../components/TextComponent';
import {Button, Input, Section, Space} from '@bsdaoquang/rncomponent';
import {fontFamilies} from '../../constansts/fontFamilies';
import {colors} from '../../constansts/colors';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '111330531866-002dqqtb5b4956s0bvi4s55ll9o3v9on.apps.googleusercontent.com',
});

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleLoginWithEmail = async () => {
    if (!email || !password) {
      setErrorText('please enter your email and password');
    } else {
      setErrorText('');
      setIsLoading(true);

      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          console.log(user);
          setIsLoading(false);
        })
        .catch((error: any) => {
          setIsLoading(false);
          setErrorText(error.message);
        });
    }
  };

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();
      console.log(idToken);
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      auth().signInWithCredential(googleCredential);
      console.log('User signed in successfully');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <Section
        styles={{
          justifyContent: 'center',
          flex: 1,
        }}>
        <TitleComponent
          text="Login"
          size={32}
          font={fontFamilies.bold}
          styles={{textTransform: 'uppercase', flex: 0, textAlign: 'center'}}
        />

        <View style={{marginVertical: 20}}>
          <Input
            value={email}
            onChange={val => setEmail(val)}
            prefix={<Sms size={20} color={colors.desc} />}
            iconClear={<CloseCircle size={20} color={colors.blue} />}
            placeholder="Email"
            clear
            label="Email"
          />
          <Input
            value={password}
            onChange={val => setPassword(val)}
            iconClear={<CloseCircle size={20} color={colors.blue} />}
            prefix={<Lock size={20} color={colors.desc} />}
            placeholder="Password"
            label="Password"
            password
            clear
          />

          {errorText && <TextComponent text={errorText} color="coral" />}
        </View>

        <Button
          loading={isLoading}
          title="Login"
          onPress={handleLoginWithEmail}
        />
        {/* <Button title="Login with Google " onPress={onGoogleButtonPress} /> */}

        <Space height={20} />
        <Text style={[globalStyles.text, {textAlign: 'center'}]}>
          You don't have an account?{' '}
          <Text
            style={{color: 'coral'}}
            onPress={() => navigation.navigate('SignUpScreen')}>
            Create an account
          </Text>
        </Text>
      </Section>
    </Container>
  );
};

export default LoginScreen;

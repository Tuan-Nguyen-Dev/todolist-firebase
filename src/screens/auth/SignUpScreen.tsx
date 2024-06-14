import {CloseCircle, Lock, Sms} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import Container from '../../components/Container';
import TitleComponent from '../../components/TitleComponent';
import {globalStyles} from '../../styles/globalStyles';
import auth from '@react-native-firebase/auth';
import TextComponent from '../../components/TextComponent';
import {Button, Input, Section, Space} from '@bsdaoquang/rncomponent';
import {fontFamilies} from '../../constansts/fontFamilies';
import {colors} from '../../constansts/colors';
import {HandleUser} from '../../utils/handleUser';

const SigninScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (email || password) {
      setErrorText('');
    }
  }, [email, password]);

  const handleSigninWithEmail = async () => {
    if (!email || !password) {
      setErrorText('Please enter your email and password!!!');
    } else {
      setErrorText('');
      setIsLoading(true);
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;

          HandleUser.SaveToDatabase(user);
          // save user to firestore

          setIsLoading(false);
        })
        .catch((error: any) => {
          setIsLoading(false);
          setErrorText(error.message);
        });
    }
  };

  return (
    <Container>
      <Section
        styles={{
          justifyContent: 'center',
          flex: 1,
        }}>
        <TitleComponent
          text="Sign In"
          size={32}
          font={fontFamilies.bold}
          styles={{textTransform: 'uppercase', flex: 0, textAlign: 'center'}}
        />

        <View style={{marginVertical: 20}}>
          <Input
            value={email}
            onChange={val => setEmail(val)}
            prefix={<Sms size={20} color={colors.desc} />}
            placeholder="Email"
            label="Email"
            iconClear={<CloseCircle size={20} color={colors.blue} />}
            clear
          />
          <Input
            value={password}
            onChange={val => setPassword(val)}
            prefix={<Lock size={20} color={colors.desc} />}
            placeholder="Password"
            label="Password"
            iconClear={<CloseCircle size={20} color={colors.blue} />}
            password
          />
          {errorText && (
            <TextComponent text={errorText} color="coral" flex={0} />
          )}
        </View>

        <Button
          loading={isLoading}
          title="Sign in"
          onPress={handleSigninWithEmail}
        />

        <Space height={20} />
        <Text style={[globalStyles.text, {textAlign: 'center'}]}>
          You have an already account?{' '}
          <Text
            style={{color: 'coral'}}
            onPress={() => navigation.navigate('LoginScreen')}>
            Login
          </Text>
        </Text>
      </Section>
    </Container>
  );
};

export default SigninScreen;

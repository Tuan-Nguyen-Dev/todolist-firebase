import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import TextComponent from './TextComponent';
import {globalStyles} from '../styles/globalStyles';
import {Row} from '@bsdaoquang/rncomponent';
import {fontFamilies} from '../constansts/fontFamilies';
import {colors} from '../constansts/colors';
import firestore from '@react-native-firebase/firestore';
import AvatarComponent from './AvatarComponent';

interface Props {
  uids: string[];
}

const AvatarGroup = (props: Props) => {
  const {uids} = props;
  const [usersName, setUsersName] = useState<
    {
      name: string;
      imgUrl: string;
    }[]
  >([]);

  useEffect(() => {
    getUserAvata();
  }, [uids]);

  const getUserAvata = async () => {
    const items: any = [...usersName];
    uids.forEach(async id => {
      await firestore()
        .doc(`users/${id}`)
        .get()
        .then((snap: any) => {
          if (snap.exists) {
            items.push({
              name: snap.data().displayName,
              imgUrl: snap.data().imgUrl ?? '',
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
    setUsersName(items);
  };

  const imageStyle = {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.white,
  };
  return (
    <Row styles={{justifyContent: 'flex-start'}}>
      {uids.map(
        (item, index) =>
          index < 3 && <AvatarComponent uid={item} index={index} key={item} />,
      )}

      {uids.length > 3 && (
        <View
          key={'total'}
          style={[
            imageStyle,
            {
              backgroundColor: 'coral',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              marginLeft: -10,
            },
          ]}>
          <TextComponent
            flex={0}
            styles={{
              lineHeight: 19,
            }}
            font={fontFamilies.semiBold}
            text={`+${uids.length - 3 > 9 ? 9 : uids.length - 3}`}
          />
        </View>
      )}
    </Row>
  );
};

export default AvatarGroup;

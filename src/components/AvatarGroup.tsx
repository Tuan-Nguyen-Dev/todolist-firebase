import React from 'react';
import {Image, View} from 'react-native';
import TextComponent from './TextComponent';
import {globalStyles} from '../styles/globalStyles';
import {Row} from '@bsdaoquang/rncomponent';
import {fontFamilies} from '../constansts/fontFamilies';
import {colors} from '../constansts/colors';

interface Props {
  uids: string[];
}

const AvatarGroup = (props: Props) => {
  const {uids} = props;
  const uidsLength = 10;
  const imageUrl = `https://th.bing.com/th/id/R.a53435c596b32a0161beb79df5080c88?rik=IXhmuoLG9kbA1w&pid=ImgRaw&r=0`;
  const imageStyle = {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.white,
  };
  return (
    <Row styles={{justifyContent: 'flex-start'}}>
      {Array.from({length: uidsLength}).map(
        (item, index) =>
          index < 3 && (
            <Image
              source={{uri: imageUrl}}
              key={`image${index}`}
              style={[imageStyle, {marginLeft: index > 0 ? -10 : 0}]}
            />
          ),
      )}

      {uidsLength > 5 && (
        <View
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
            text={`+${uidsLength - 3 > 9 ? 9 : uidsLength - 3}`}
          />
        </View>
      )}
    </Row>
  );
};

export default AvatarGroup;

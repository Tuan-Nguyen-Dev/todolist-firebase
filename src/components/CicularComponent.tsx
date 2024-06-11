import React from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import {colors} from '../constansts/colors';
import {fontFamilies} from '../constansts/fontFamilies';

interface Props {
  color?: string;
  value: number;
  maxValue?: number;
  radius?: number;
}

const CicularComponent = (props: Props) => {
  const {color, value, maxValue, radius} = props;
  return (
    <CircularProgress
      value={value}
      title={`${value}%`}
      radius={radius ?? 46}
      showProgressValue={false}
      activeStrokeColor={color ?? colors.blue}
      inActiveStrokeColor={'#3C444A'}
      titleColor={colors.text}
      activeStrokeWidth={14}
      inActiveStrokeWidth={14}
      titleFontSize={20}
      titleStyle={{
        fontFamily: fontFamilies.medium,
      }}
    />
  );
};

export default CicularComponent;

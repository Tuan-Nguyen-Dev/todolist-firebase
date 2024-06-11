import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Container from '../components/Container';
import {globalStyles} from '../styles/globalStyles';
import {Card, Row, Section, Space, Text} from '@bsdaoquang/rncomponent';
import {colors} from '../constansts/colors';
import {fontFamilies} from '../constansts/fontFamilies';
import TextComponent from '../components/TextComponent';
import TitleComponent from '../components/TitleComponent';
import {Element4, Notification, SearchNormal} from 'iconsax-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TagComponent from '../components/TagComponent';
import CicularComponent from '../components/CicularComponent';

const HomeScreen = () => {
  return (
    <Container>
      <Section>
        <Row justifyContent="space-between">
          <Element4 size={24} color={colors.desc} />
          <Notification size={24} color={colors.desc} />
        </Row>
      </Section>
      <Section>
        <Text color={colors.white} text="Hi, Nguyen Tuan" />
        <Text
          text="Hello My name is Tuan"
          color={colors.white}
          font={fontFamilies.semiBold}
          size={20}
        />
      </Section>
      <Section>
        <Row
          styles={[globalStyles.inputContainer]}
          onPress={() => console.log('On lick')}>
          <TextComponent color={colors.gray2} text="Search task" />
          <SearchNormal size={20} color={colors.white} />
        </Row>
      </Section>
      <Section>
        <Card styles={{backgroundColor: colors.gray, marginHorizontal: 0}}>
          <Row>
            <View style={{flex: 1}}>
              <TitleComponent text="Task Progess" />
              <TextComponent text="30/40t task done !" />
              <Space height={10} />
              <Row justifyContent="flex-start">
                <TagComponent
                  text="Match 22"
                  onPress={() => console.log('Say hi >>>')}
                />
              </Row>
            </View>
            <View>
              <CicularComponent value={80} />
            </View>
          </Row>
        </Card>
      </Section>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Container from '../components/Container';
import {globalStyles} from '../styles/globalStyles';
import {Card, Row, Section, Space, Text} from '@bsdaoquang/rncomponent';
import {colors} from '../constansts/colors';
import {fontFamilies} from '../constansts/fontFamilies';
import TextComponent from '../components/TextComponent';
import TitleComponent from '../components/TitleComponent';
import {
  Add,
  Edit2,
  Element4,
  Notification,
  SearchNormal,
} from 'iconsax-react-native';
import TagComponent from '../components/TagComponent';
import CicularComponent from '../components/CicularComponent';
import CardImageConponent from '../components/CardImageConponent';
import AvatarGroup from '../components/AvatarGroup';
import ProgressBarComponent from '../components/ProgressBarComponent';

const HomeScreen = () => {
  return (
    <View style={{flex: 1}}>
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
        <Section>
          <Row styles={{alignItems: 'flex-start'}}>
            <View style={{flex: 1}}>
              <CardImageConponent>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[globalStyles.iconContainer]}>
                  <Edit2 size={20} color={colors.white} />
                </TouchableOpacity>
                <TitleComponent text="UX Design" />
                <TextComponent text="Task managments mobile app" size={15} />

                <View style={{marginVertical: 30}}>
                  <AvatarGroup />
                  <ProgressBarComponent percent="70%" />
                </View>

                <TextComponent text="Due, 2023 Match 03" />
              </CardImageConponent>
            </View>
            <Space width={16} />
            <View style={{flex: 1}}>
              <CardImageConponent color="rgba(33,150,243,0.9)">
                <TouchableOpacity
                  onPress={() => {}}
                  style={[globalStyles.iconContainer]}>
                  <Edit2 size={20} color={colors.white} />
                </TouchableOpacity>
                <TitleComponent text="API Payment" />
                <AvatarGroup />
                <ProgressBarComponent percent="40%" />
              </CardImageConponent>
              <Space height={10} />
              <CardImageConponent color="rgba(18,181,22,0.9)">
                <TouchableOpacity
                  onPress={() => {}}
                  style={[globalStyles.iconContainer]}>
                  <Edit2 size={20} color={colors.white} />
                </TouchableOpacity>
                <TitleComponent text="Up work" />
                <TextComponent text="Revision home page" size={15} />
              </CardImageConponent>
            </View>
          </Row>
        </Section>
        <Section>
          <TitleComponent text="Urgents task" />
          <Card styles={{backgroundColor: colors.gray, marginHorizontal: 0}}>
            <Row>
              <CicularComponent value={40} radius={36} />
              <View
                style={{flex: 1, justifyContent: 'center', paddingLeft: 12}}>
                <TextComponent text="Title of task" />
              </View>
            </Row>
          </Card>
        </Section>
      </Container>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={[
            globalStyles.row,
            {
              backgroundColor: colors.blue,
              padding: 10,
              borderRadius: 100,
              width: '80%',
            },
          ]}>
          <TextComponent text="Add new tasks" flex={0} />
          <Add size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

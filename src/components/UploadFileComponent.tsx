import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Attachment} from '../models/TaskModel';
import {DocumentUpload} from 'iconsax-react-native';
import {colors} from '../constansts/colors';
import DocumentPicker, {
  DocumentPickerOptions,
  DocumentPickerResponse,
} from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import TextComponent from './TextComponent';
import {globalStyles} from '../styles/globalStyles';
import TitleComponent from './TitleComponent';
import {Row, Space} from '@bsdaoquang/rncomponent';
import {calcFileSize} from '../utils/calcFileSize';
import {Slider} from '@miblanchard/react-native-slider';
import {PermissionsAndroid, Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
interface Props {
  onUpload: (file: Attachment) => void;
}

const UploadFileComponent = (props: Props) => {
  const {onUpload} = props;

  const [file, setFile] = useState<DocumentPickerResponse>();
  const [isVisibleModalUpload, setIsVisibleModalUpload] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
  const [attachemenFile, setAttachemenFile] = useState<Attachment>();

  useEffect(() => {
    file && handleUploadFileToStorage();
  }, [file]);

  useEffect(() => {
    if (attachemenFile) {
      //   console.log(attachemenFile);
      onUpload(attachemenFile);
      setIsVisibleModalUpload(false);
      setProgressUpload(0);
      setAttachemenFile(undefined);
    }
  }, [attachemenFile]);

  async function requestStoragePermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to upload files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('Storage permission denied');
        }
      } else {
        const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (result === RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('Storage permission denied');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const handleUploadFileToStorage = () => {
    if (file) {
      setIsVisibleModalUpload(true);

      const path = `/documents/${file.name}`;

      const res = storage().ref(path).putString(file.uri);
      res.on('state_changed', task => {
        setProgressUpload(task.bytesTransferred / task.totalBytes);
      });

      res
        .then(() => {
          storage()
            .ref(path)
            .getDownloadURL()
            .then(url => {
              const data: Attachment = {
                name: file.name ?? '',
                url,
                size: file.size ?? 0,
              };
              setAttachemenFile(data);
            });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() =>
          DocumentPicker.pick({
            allowMultiSelection: false,
          }).then(res => setFile(res[0]))
        }>
        <DocumentUpload size={24} color={colors.white} />
      </TouchableOpacity>
      <Modal
        visible={isVisibleModalUpload}
        animationType="slide"
        style={{flex: 1}}
        statusBarTranslucent
        transparent>
        <View
          style={[
            globalStyles.container,
            {
              backgroundColor: `${colors.gray}A1`,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View
            style={{
              width: Dimensions.get('window').width * 0.8,
              height: 'auto',
              padding: 12,
              backgroundColor: colors.white,
              borderRadius: 12,
            }}>
            <TitleComponent text="Uploading" color={colors.bgColor} flex={0} />
            <Space height={10} />
            <View>
              <TextComponent
                color={colors.bgColor}
                text={file?.name ?? ''}
                flex={0}
              />
              <TextComponent
                color={colors.gray2}
                text={`${calcFileSize(file?.size as number)} byte`}
                flex={0}
              />
            </View>
            <Row>
              <View style={{flex: 1, marginRight: 12}}>
                <Slider
                  disabled
                  value={progressUpload}
                  renderThumbComponent={() => null}
                  trackStyle={{height: 6, borderRadius: 100}}
                  minimumTrackTintColor="#00733B"
                  maximumTrackTintColor={colors.desc}
                />
              </View>
              <TitleComponent
                text={`${Math.floor(progressUpload * 100)}%`}
                color={colors.bgColor}
              />
            </Row>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UploadFileComponent;

const styles = StyleSheet.create({});

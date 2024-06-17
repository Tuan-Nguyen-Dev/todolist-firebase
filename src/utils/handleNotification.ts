import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import { PermissionsAndroid, Platform } from 'react-native';
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const user = auth().currentUser



export class HandleNotification {
    static checkNotificationPermission = async () => {
        const authStatus = await messaging().requestPermission();

        if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
            if (Platform.OS === 'ios') {
                try {
                    await messaging().registerDeviceForRemoteMessages();
                } catch (error) {
                    console.log(error);
                }
            } else {
                this.getFcmToken();
            }
        }
    };
    static getFcmToken = async () => {
        const fcmToken = await AsyncStorage.getItem('fcmToken');

        if (!fcmToken) {
            const token = await messaging().getToken()

            if (token) {
                await AsyncStorage.setItem('fcmToken', token)
                this.UpdateTokne(token)
            }
        }
    }
    static UpdateTokne = async (token: string) => {

        await firestore().doc(`users/${user?.uid}`).get().then(snap => {
            if (snap.exists) {
                const data: any = snap.data()
                if (!data.tokens || !data.tokens.includes(token)) {
                    firestore().doc(`users/${user?.uid}`).update({
                        tokens: firestore.FieldValue.arrayUnion(token)
                    })
                }
            }
        })
    }

    // static SendNotfication = async ({
    //     memberId, title, body, taskId
    // }: { memberId: string, title: string, body: string, taskId: string }) => {
    //     try {
    //         const member: any = await firestore().doc(`users/${memberId}`).get()
    //         if (member && member.data().tokens) {
    //             const myHeaders = new Headers();
    //             myHeaders.append("Content-Type", "application/json");
    //             myHeaders.append("Authorization", "Bearer ya29.c.c0AY_VpZhTEpkh35r0_1AN-iF73kKWABF9ylqUlHk8dkFsP1NHVpUcorQmvQ63W7_dc8JGvsYnLuL4Ej7Ztx9hvgB0-aENoNHxvn84BBuYLAmoexPQrdndNk-DUF4rqAEoHfOgNxE6MT-0f-08YYfj_Yfe2dkihMW1rpMWlKSJTSBJrrDC1BLON_NJz4d3OgJXeq2mG2x3ahB0IHKF20ikR6SP8fkn6P2a9NpvNPW0waXqrocSzPh_cZQbAa1wUQ3nd7reDx-2pG-LaCfecLtvw8CkJF6dVYfFx5cJRmxKuTgYJ6770EDe17dy3i4xU4Bv0xNl33-GpHr9OOEcYYGebBMu5P8_3wfSx5GypH6I2GM4ofjojNx3Ptm6E385DW-ZwvuJBWizcYbfoc9qoq7j-FnXyj7tYB9b_Sg83oSux5rkmVM7v2c1Bu8jslQ18yMo-X1urIhXFVcg1hhd8JVbW3Up2xsjyxFk9FSRr5mii5hYfYl6qedV_JdVnqFZaU9q3pp0kbZ6WfhJcUye1RjhzucZdV8ndfXYosW_Zp14pkpSuescOptS5skyfkxZXjvlUWqy2j7ZV93jiorkwVspizdu62FSswbX81OI8upVe8luubMp7iWXa0vg0ykFiaWSJJBU1SzJX64Zsl8JRrqioJpbhhcIfqfi7Mhfxi1ijMBr6cRWkz1ll2_69zkfosQFpBaIw1X0sJgsSVd5geOq9Xwg0g6WitewegxOy1Ykd14azUgrYjqhF05hz6oZwZ9hkS_yS0VzX7cI1ihzl4mibFtB8BJMWdZgf9vIIOv3unx1Rvkwwv-BV7p_6O0tqUiba898XJnozv2ww6Rk8WlqXXnMQo119neU7f54keFaIV3QMqFiVZS8hisq7ic5QjztIpI5aSrigrI7bYVYdzlr6wyJ6IZYmRb6_8a4Vdb9vssw98WRUfBXm-Zi6rrZrvZ1eQQd5fWQ6OUuu10kc0iW6YZ51lUobk8ypdbmOXFwoM3hm_Ftr2qYa2k");

    //             const raw = JSON.stringify({
    //                 message: {
    //                     token: 'cAOtmQCtTGeS8IgqIHoF8C:APA91bHOvjaFoy1KubiCroqErN7GYBPbVBpDZQ3b_Qlnj53YOPuvYzXykpMC4Fz_VFTNKOp-uP-QaTIUCTmY2X95wqNNcQ2vYBbu5zKlNwU3DvwSCO428PdDHqt30_bVGeOqz8xkfXgh',
    //                     notification: {
    //                         title,
    //                         body,
    //                     },
    //                     // "data": {
    //                     //     "id": "66446771c4e50188a9afdcde"
    //                     // }
    //                 }
    //             });

    //             const requestOptions: any = {
    //                 method: "POST",
    //                 headers: myHeaders,
    //                 body: raw,
    //                 redirect: "follow"
    //             };

    //             fetch("https://fcm.googleapis.com/v1/projects/todolist-note-53cc5/messages:send", requestOptions)
    //                 .then((response) => response.text())
    //                 .then((result) => console.log(result))
    //                 .catch((error) => console.error(error));
    //         }

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    static SendNotfication = async ({
        memberId, title, body, taskId
    }: { memberId: string, title: string, body: string, taskId: string }) => {
        try {
            const member: any = await firestore().doc(`users/${memberId}`).get();
            if (member && member.data().tokens) {
                const tokens = member.data().tokens;

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer ya29.c.c0AY_VpZhTEpkh35r0_1AN-iF73kKWABF9ylqUlHk8dkFsP1NHVpUcorQmvQ63W7_dc8JGvsYnLuL4Ej7Ztx9hvgB0-aENoNHxvn84BBuYLAmoexPQrdndNk-DUF4rqAEoHfOgNxE6MT-0f-08YYfj_Yfe2dkihMW1rpMWlKSJTSBJrrDC1BLON_NJz4d3OgJXeq2mG2x3ahB0IHKF20ikR6SP8fkn6P2a9NpvNPW0waXqrocSzPh_cZQbAa1wUQ3nd7reDx-2pG-LaCfecLtvw8CkJF6dVYfFx5cJRmxKuTgYJ6770EDe17dy3i4xU4Bv0xNl33-GpHr9OOEcYYGebBMu5P8_3wfSx5GypH6I2GM4ofjojNx3Ptm6E385DW-ZwvuJBWizcYbfoc9qoq7j-FnXyj7tYB9b_Sg83oSux5rkmVM7v2c1Bu8jslQ18yMo-X1urIhXFVcg1hhd8JVbW3Up2xsjyxFk9FSRr5mii5hYfYl6qedV_JdVnqFZaU9q3pp0kbZ6WfhJcUye1RjhzucZdV8ndfXYosW_Zp14pkpSuescOptS5skyfkxZXjvlUWqy2j7ZV93jiorkwVspizdu62FSswbX81OI8upVe8luubMp7iWXa0vg0ykFiaWSJJBU1SzJX64Zsl8JRrqioJpbhhcIfqfi7Mhfxi1ijMBr6cRWkz1ll2_69zkfosQFpBaIw1X0sJgsSVd5geOq9Xwg0g6WitewegxOy1Ykd14azUgrYjqhF05hz6oZwZ9hkS_yS0VzX7cI1ihzl4mibFtB8BJMWdZgf9vIIOv3unx1Rvkwwv-BV7p_6O0tqUiba898XJnozv2ww6Rk8WlqXXnMQo119neU7f54keFaIV3QMqFiVZS8hisq7ic5QjztIpI5aSrigrI7bYVYdzlr6wyJ6IZYmRb6_8a4Vdb9vssw98WRUfBXm-Zi6rrZrvZ1eQQd5fWQ6OUuu10kc0iW6YZ51lUobk8ypdbmOXFwoM3hm_Ftr2qYa2k");

                const sendNotification = async (token: string) => {
                    const raw = JSON.stringify({
                        message: {
                            token: token,
                            notification: {
                                title,
                                body,
                            },
                        }
                    });

                    const requestOptions: any = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    };

                    try {
                        const response = await fetch("https://fcm.googleapis.com/v1/projects/todolist-note-53cc5/messages:send", requestOptions);
                        const result = await response.text();
                        console.log(result);
                    } catch (error) {
                        console.error(error);
                    }
                };

                if (Array.isArray(tokens)) {
                    for (const token of tokens) {
                        await sendNotification(token);
                    }
                } else {
                    await sendNotification(tokens);
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

}
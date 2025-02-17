// @flow
import { DeviceEventEmitter } from 'react-native';
import PushNotification from '../components/notification';
import navigationService from '../service/navigationService';
import { ROUTE_NAMES, TASK_TYPE, TASK_STATUS } from '../constant';

const defaultOptions = {
  /* Android Only Properties */
  // id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
  ticker: '通知', // (optional)
  autoCancel: true, // (optional) default: true
  color: 'blue', // (optional) default: system default
  vibrate: true, // (optional) default: true
  vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  group: 'stube', // (optional) add group to message
  ongoing: false, // (optional) set whether this is an "ongoing" notification
  priority: 'high', // (optional) set notification priority, default: high
  visibility: 'public', // (optional) set notification visibility, default: private
  importance: 'high', // (optional) set notification importance, default: high
  // rightButton: true, // use UI that has right button
  // buttonTitle: '', // right button title
};

type Options = {
  id?: String,
  title: String, // (optional)
  message: String, // (required)
  bigText: String, // (optional) default: "message" prop
  tag: String, // (optional) add tag to message
  routeName: String, // the route to navigate
};

const notification = {
  message: (config: Options) => {
    PushNotification.localNotification(Object.assign({}, defaultOptions, config));
  },
  warning: (config: Options) => {
    PushNotification.localNotification(
      Object.assign({}, defaultOptions, config, {
        color: 'yellow',
      }),
    );
  },
  error: (config: Options) => {
    PushNotification.localNotification(
      Object.assign({}, defaultOptions, config, {
        color: 'red',
      }),
    );
  },
  cancel: id => {
    if (id) {
      PushNotification.clearLocalNotification(Number(id));
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  },
};

function init() {
  PushNotification.configure({
    onRegister(token) {
      console.log('TOKEN:', token);
    },
    onNotification(notificationOpt) {
      console.log('NOTIFICATION:', notificationOpt);
      if (notificationOpt.play) {
        navigationService.navigate(notificationOpt.routeName || ROUTE_NAMES.download, {
          taskId: notificationOpt.task.id,
        });
        return;
      }
      navigationService.navigate(notificationOpt.routeName || ROUTE_NAMES.download, notificationOpt);
      // if magnet && success, open file selector
      if (notificationOpt.task && notificationOpt.task.type === TASK_TYPE.MAGNET && notificationOpt.task.status === TASK_STATUS.SUCCESS) {
        DeviceEventEmitter.emit('TORRENT_DOWNLOADED', {
          path: notificationOpt.task.path,
        });
      }
    },
    onNotificationCancel(notificationOpt) {
      console.log(JSON.stringify(notificationOpt));
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: true,
  });
}

notification.init = init;

export default notification;

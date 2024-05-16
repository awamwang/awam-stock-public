import { ElNotification, NotificationProps } from 'element-plus'

export default function () {
  function notify(message: string, options: Partial<NotificationProps> = {}) {
    const { duration = 1 } = options

    ElNotification({
      title: '消息',
      message: message || 'message',
      position: 'bottom-right',
      type: 'success',
      ...options,
      duration: duration * 1000,
    })
  }

  return {
    notify,
  }
}

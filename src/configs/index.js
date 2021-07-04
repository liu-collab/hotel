
import mode from './module'

//导出需要的版本地址
export let base_url = mode['dev'].url //开发时依赖的地址

//上传头像地址
export let admin_upload_url = base_url + "/Admin/UploadImg"
//访问头像地址
export let admin_phont_url = base_url + "/upload/admin/"

//上传头像地址
export let room_upload_url = base_url + "/RoomImg/UploadImg"
//访问头像地址
export let room_phont_url = base_url + "/upload/room/"

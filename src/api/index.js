/*
 * 与后台交互模块 （依赖已封装的ajax函数）
 * 包含n个接口请求函数的模块，函数的返回值是promise对象
 */
import ajax from '../api/ajax'
/**
 * ajax 有如下4个参数
 * @param {*} url 请求路径，默认为空
 * @param {*} method 请求方法，默认为GET
 * @param {*} params 请求参数，默认为空对象
 * @param {*} data 请求参数，默认为空对象
 */
/** *********************************用户相关**************************************************** */
/**
 * 用户登录
 */
export const login = (data) => ajax('/v1/user/signin', 'POST', null, data)
export const logout = () => ajax('/v1/user/logout', 'POST')
export const basicInfo = () => ajax('/v1/uias/user/basicInfo', 'GET', null, null)
// 获取安全验证设备 /v1/uias/security/verification/device
export const GetSecurityDevice = () => ajax('/v1/uias/security/verification/device', 'GET', null, null)
// 创建VMFA设备 /v1/uias/vmfa/otp/devices
export const CreateVmfa = () => ajax('/v1/uias/vmfa/otp/devices', 'POST')
// 绑定VMFA设备 /v1/uias/vmfa/otp/bind
export const BindVmfa = (data) => ajax('/v1/uias/vmfa/otp/bind', 'POST', null, data)

// 校验验证码 /v1/uias/captcha/:schema/verify
export const VerifyCaptcha = (patch, data) => ajax(`/v1/uias/captcha/${patch.schema}/verify`, 'POST', null, data)
// /v1/uias/captcha/send?variety=email
export const GetCaptcha = (params) => ajax('/v1/uias/captcha/send', 'GET', params)

// 重置/解绑VMFA设备 /v1/uias/vmfa/otp/reset
export const ResetVmfa = () => ajax('/v1/uias/vmfa/otp/reset', 'POST')

// 修改用户信息 patch /v1/uias/user/basicInfo
export const UpdateUserInfo = (data) => ajax('/v1/uias/user/basicInfo', 'PATCH', null, data)
// 打开或关闭登录验证 POST /v1/uias/user/2fa/toggle
export const ToggleSip = (data) => ajax('/v1/uias/user/2fa/toggle', 'POST', null, data)

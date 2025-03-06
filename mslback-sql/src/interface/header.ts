import { commonFun } from "clsfunc/commonfunc";

export const CheckHeaders = () => {
    const serviceTypes = ['web-user', 'web-parent', 'web-business', 'mobile-business', 'mobile-parent', 'mobile-user']
    return {
        signature: process.env.SIGNATURE,
        // serivceType: serviceTypes
        // signature: commonFun.generateSignature(),
    };
}
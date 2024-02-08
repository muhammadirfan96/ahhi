import 'dotenv/config';

let accessTokenKey;
process.env.NODE_ENV === 'production'
    ? (accessTokenKey = 'ijnmkoubgtdtfre43ew435e667fy72wr338dgrtx')
    : (accessTokenKey = process.env.ACCESS_TOKEN);

let refreshTokenKey;
process.env.NODE_ENV === 'production'
    ? (refreshTokenKey = '0io9u8ygtr645dsdw43fsvvxfdg4yrdg43s9484')
    : (refreshTokenKey = process.env.REFRESH_TOKEN);

let resetPasswordTokenKey;
process.env.NODE_ENV === 'production'
    ? (resetPasswordTokenKey = 'u943rdr3sexvx5rnji954gdt4njdre95i5f')
    : (resetPasswordTokenKey = process.env.RESET_PASSWORD_TOKEN);

let activationUserTokenKey;
process.env.NODE_ENV === 'production'
    ? (activationUserTokenKey = '95ur95e53d43dsd3fbccbggu8jsw85ur85')
    : (activationUserTokenKey = process.env.ACTIVATION_USER_TOKEN);

export { accessTokenKey, refreshTokenKey, resetPasswordTokenKey, activationUserTokenKey };

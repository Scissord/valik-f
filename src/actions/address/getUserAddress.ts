"use server";

export const getUserAddress = async (userId: string) => {
  try {
    const mockAddress = {
      id: '1',
      userId,
      address: 'Улица Примерная, 123',
      address2: '',
      countryId: 'RU',
      firstName: 'Иван',
      lastName: 'Иванов',
      phone: '+7 999 123-45-67',
      city: 'Москва',
      postalCode: '123456'
    };
    
    const {countryId,...rest} = mockAddress;
    return { ...rest, country: countryId };
  } catch (error) {
    console.log(error);
    return null;
  }
};

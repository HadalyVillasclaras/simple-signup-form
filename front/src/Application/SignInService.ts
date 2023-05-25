import { UserRepositoryInterface } from '../Domain/UserRepositoryInterface';
import { User } from '../Domain/User';
import { Email } from '../Domain/ValueObjects/Email';
import { Password } from '../Domain/ValueObjects/Password';
import { SignInError } from '../Domain/Exceptions/SignInException';

export default class SignInService {
  private userRepository: UserRepositoryInterface;

  constructor(userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository;
  }

  async signIn(formData: any): Promise<any> {
    const errors: {field: string, message: string}[] = [];

      const requestData: any = {};
      formData.forEach((value: string, key: any) => {
        if (value === '') {
          errors.push({ field: key, message: 'This field cannot be empty.' });
        }
        requestData[key] = value;
      });

      let email: Email;
    
      try {
        email = new Email(requestData['email']);
      } catch (error) {
        errors.push({ field: 'email', message: error.message });
      }
    
      if (errors.length > 0) {
        return { status: 'error', errors };
      }
      
      const loginUser = {
        email: requestData['email'],
        password: requestData['password'],
      };

      try {
        const response = await this.userRepository.signIn(loginUser);
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        throw { status: 'error', message: error.message };
      }

 
  }
}
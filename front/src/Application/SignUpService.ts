import { User } from '../Domain/User';
import { UserRepositoryInterface } from '../Domain/UserRepositoryInterface';
import { Email } from '../Domain/ValueObjects/Email';
import { Password } from '../Domain/ValueObjects/Password';

export default class SignUpService {
  private userRepository: UserRepositoryInterface;

  constructor(userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository;
  }

  async signUp(formData: any): Promise<any> {
    try {
      const requestData: any = {};
      formData.forEach((value: string, key: string) => {
        if (value === '') {
          throw Error(`Field ${key} cannot be null`)
        }
        requestData[key] = value;
      });

      const user: User = {
        name: requestData['name'],
        surname: requestData['surname'],
        email: new Email(requestData['email']),
        password: new Password(requestData['password']),
      };

      const response = await this.userRepository.addUser(user);
      const responseData = await response.json();
      return responseData;

    } catch (error) {
      throw { status: 'error', message: error.message };
    }
  }
}
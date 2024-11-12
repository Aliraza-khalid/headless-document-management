import { UserDAO } from "../db/schema/User";
import { CreateUserDTO, UserResponseDTO } from "../dto/users.dto";
import { userModelToDto } from "../mappers/user.mapper";
import { inject, injectable } from "inversify";
import { ContainerTokens } from "../types/container";
import UserRepository from "../repositories/user.repository";
import HashService from "./hash.service";
import LoggerService from "./logger.service";

injectable();
export default class UserService {
  constructor(
    @inject(ContainerTokens.Logger)
    private readonly loggerService: LoggerService,
    @inject(ContainerTokens.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(ContainerTokens.HashService)
    private readonly hashService: HashService
  ) {}

  async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
    try {
      const hashedPassword = await this.hashService.hashPassword(data.password);
      const newUser = await this.userRepository.create({
        ...data,
        password: hashedPassword,
      });
      this.loggerService.info(`Create User - ${newUser.email}`);
      return userModelToDto(newUser);
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(): Promise<UserResponseDTO[]> {
    try {
      const users = await this.userRepository.findAll();
      this.loggerService.info(`Fetch All Users`);
      return users.map((user) => userModelToDto(user));
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserResponseDTO> {
    try {
      const user = await this.userRepository.findById(id);
      this.loggerService.info(`Fetch User By Id - ${user.email}`);
      return userModelToDto(user);
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserDAO> {
    try {
      const user = await this.userRepository.findOne({ email });
      this.loggerService.info(`Fetch User By Email - ${user.email}`);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, userData: any): Promise<UserResponseDTO> {
    try {
      const updatedUser = await this.userRepository.update(id, userData);
      this.loggerService.info(`Update User - ${updatedUser.email}`);
      return userModelToDto(updatedUser);
    } catch (error) {
      throw error;
    }
  }
}

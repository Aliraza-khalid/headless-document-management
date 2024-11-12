import { UserTable, UserDAO } from "../db/schema/User";
import { CreateUserDTO, UserResponseDTO } from "../dto/users.dto";
import { userModelToDto } from "../mappers/user.mapper";
import { hashPassword } from "./auth.service";
import { inject, injectable } from "inversify";
import { ContainerTokens } from "../types/container";
import UserRepository from "../repositories/user.repository";

injectable();
export default class UserService {
  constructor(
    @inject(ContainerTokens.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
    try {
      const hashedPassword = await hashPassword(data.password);
      const newUser = await this.userRepository.create({
        ...data,
        password: hashedPassword,
      } as any);
      return userModelToDto(newUser as any);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<UserResponseDTO[]> {
    try {
      const users = await this.userRepository.findAll();
      return users.map((user: any) => userModelToDto(user));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserResponseDTO> {
    try {
      const user = await this.userRepository.findById(id);
      return userModelToDto(user as any);
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserDAO> {
    try {
      const user = await this.userRepository.findOne({ email });
      return user as any;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async updateUser(id: string, userData: any): Promise<UserResponseDTO> {
    try {
      const updatedUser = await this.userRepository.update(id, userData);
      return userModelToDto(updatedUser as any);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

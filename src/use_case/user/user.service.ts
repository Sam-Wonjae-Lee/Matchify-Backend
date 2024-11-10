import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UserService { 

    constructor(private readonly databaseService: DatabaseService) {}

    async getUser(user: string) {
        const response = await this.databaseService.getUser(user);
        return response;
    }

    async updateUser(id: string, bio: string, location: string, gender: string, fav_playlist: string, dob: string) {
        return await this.databaseService.updateUserInfo({user_id: id, bio, location, gender, favourite_playlist: fav_playlist, dob})
    }

    async updateUserVector(vector: object, id: string) {
        console.log("WPDOKDPWO")
        return await this.databaseService.updateUserVector(vector, id);
    }

    async getUserFriends(user: string){
        return await this.databaseService.getUserFriends(user);
    }

    async getIsUserFriendsWith(user: string, userToCheck: string) {
        const response = await this.databaseService.getIsUserFriendsWith(user, userToCheck);
        if (response) {
            return {status: true}
        }
        return {status: false}
    }

    async unfriend(user: string, unfriended: string) {
        return await this.databaseService.unfriend(user, unfriended);
    }
}

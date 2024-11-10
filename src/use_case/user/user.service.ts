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

    async getUserMatch(user: string) {
        function calculateDistance(vector1: number[], vector2: number[]): number {
            let sum = 0;
            for (let i = 0; i < vector1.length; i++) {
                sum += Math.pow(vector1[i] - vector2[i], 2);
            }
            return Math.sqrt(sum);
        }
    
        function extractVector(user: any): number[] {
            return [
                user.popularity,
                user.danceability,
                user.energy,
                user.valence,
                user.acousticness,
                user.speechiness,
                user.instrumentalness
            ];
        }
    
        let arr = await this.databaseService.getUserVectors();
        console.log('User Vectors:', arr);
    
        let userVector = arr.find(v => v.user_id === user);
        console.log('User Vector:', userVector);
    
        if (!userVector) {
            throw new Error('User not found');
        }
    
        let userVectorArray = extractVector(userVector);
    
        let closest_vec = null;
        let closest_distance = Infinity;
    
        // Create an array of objects with user_id and the corresponding distance
        const distanceArray = arr
        .filter(item => item.user_id !== user)  // Filter out the current user
        .map(item => {
            const currentVectorArray = extractVector(item);
            const distance = calculateDistance(userVectorArray, currentVectorArray);
            return { ...item, distance };  // Add the distance to each object
        });

        // Sort the array by distance (ascending order)
        distanceArray.sort((a, b) => a.distance - b.distance);
    
        const k : number = 2;
        const arrr = [];
        for (let i = 0; i < k; i++) {
            const user = await this.databaseService.getUser(distanceArray[i].user_id);
            arrr.push(user)
        }
        console.log(arrr);
        return arrr;
        // if (closest_vec) {
        //     console.log('Closest Vector:', closest_vec);
        //     return await this.databaseService.getUser(closest_vec.user_id);
        // } else {
        //     throw new Error('No other users to compare');
        // }
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

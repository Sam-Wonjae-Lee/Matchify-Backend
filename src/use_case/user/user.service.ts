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
    
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].user_id !== user) {
                let currentVectorArray = extractVector(arr[i]);
                let distance = calculateDistance(userVectorArray, currentVectorArray);
                if (distance < closest_distance) {
                    closest_distance = distance;
                    closest_vec = arr[i];
                }
            }
        }
    
        if (closest_vec) {
            console.log('Closest Vector:', closest_vec);
            return closest_vec.user_id;
        } else {
            throw new Error('No other users to compare');
        }
    }
}
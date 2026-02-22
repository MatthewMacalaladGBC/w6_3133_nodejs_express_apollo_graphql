import MovieModel from '../models/movie.js';
import { GraphQLError } from 'graphql';

// Resolvers define the technique for fetching the types defined in the schema.
const resolvers = {

    Query: {

        getAllMovies: async () => {
            return await MovieModel.find({});
        },

        getMovieById: async (_, {id}) => {
            if (!id) {
                throw new GraphQLError("ID is required to fetch a movie", {
                    extensions: {
                        code: "MISSING_ID",
                        field: "id",
                        http: { status: 400 }
                    }
                });
            }

            const movie = await MovieModel.findById(id);
            if (!movie) {
                throw new GraphQLError(`Movie not found with ID: ${id}`, {
                    extensions: {
                        code: "MOVIE_NOT_FOUND",
                        field: "id",
                        http: { status: 404 }
                    }
                });
            }
            return movie;
        },

        getMoviesByDirector: async (_, {director_name}) => {
            return await MovieModel.find({ director_name });
        }

    },

    Mutation: {
        addMovie: async (_, { name, director_name, production_house, release_date, rating }) => {
            const newMovie = new MovieModel({
                name,
                director_name,
                production_house,
                release_date,
                rating
            });
            return await newMovie.save();
        },

        updateMovie: async (_, { id, name, director_name, production_house, release_date, rating }) => {
            const updatedMovie = await MovieModel.findByIdAndUpdate(
                id,
                { name, director_name, production_house, release_date, rating },
                { new: true }
            );
            return updatedMovie;
        },

        deleteMovie: async (_, {id}) => {
            const deletedMovie = await MovieModel.findByIdAndDelete(id);
            return deletedMovie;
        }

    }

}

export default resolvers
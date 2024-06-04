import {z} from 'zod'

const movieSchema = z.object({
    title: z.string({
      title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required',
      })
    }),
    director: z.string(),
    year: z.number().int().min(1900).max(2000),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).optional(),
    poster: z.string(),
    genre: z.array(
      z.enum(['Action', 'Adventure', 'Terror']),
      {
        invalid_type_error: 'Movie genre must be an array of strings',
        required_error: 'Movie genre is required',
      }
    )
  })

export function validateMovie(object){
    return movieSchema.safeParse(object)
}

export function validatePartialMovie(input){
  return movieSchema.partial().safeParse(input)
}
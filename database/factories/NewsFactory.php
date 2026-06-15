<?php

namespace Database\Factories;

use App\Models\News;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<News>
 */
class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        $title = $this->faker->sentence();
        return [
            'user_id' => User::factory(),
            'title' => $title,
            'slug' => News::generateSlug($title),
            'category' => $this->faker->randomElement([
                'Nasional', 'Internasional', 'Politik', 'Ekonomi',
                'Olahraga', 'Teknologi', 'Hiburan', 'Kesehatan',
                'Pendidikan', 'Budaya', 'Lingkungan', 'Hukum', 'Umum'
            ]),
            'author' => $this->faker->name(),
            'excerpt' => $this->faker->paragraph(),
            'content' => '<p>' . implode('</p><p>', $this->faker->paragraphs(3)) . '</p>',
            'image' => null,
            'image_caption' => $this->faker->sentence(),
            'meta_description' => $this->faker->text(150),
            'tags' => $this->faker->words(3),
            'status' => $this->faker->randomElement(['draft', 'published', 'archived']),
            'is_featured' => $this->faker->boolean(20),
            'published_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'views' => $this->faker->numberBetween(0, 1000),
            'reading_time' => 3,
        ];
    }
}

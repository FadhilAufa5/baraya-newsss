<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'manage users',
            'manage roles',
            'create news',
            'edit news',
            'delete news',
            'publish news',
            'view news',
            'manage short videos',
            'manage iklan',
            'manage comments',
            'access dashboard',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $superAdmin->givePermissionTo(Permission::all());

        $editor = Role::firstOrCreate(['name' => 'Editor']);
        $editor->givePermissionTo([
            'create news',
            'edit news',
            'delete news',
            'publish news',
            'view news',
            'manage short videos',
            'manage comments',
            'access dashboard',
        ]);

        $writer = Role::firstOrCreate(['name' => 'Writer']);
        $writer->givePermissionTo([
            'create news',
            'edit news',
            'view news',
            'manage short videos',
            'access dashboard',
        ]);

        $subscriber = Role::firstOrCreate(['name' => 'Subscriber']);
        $subscriber->givePermissionTo(['view news']);

        // Assign Super Admin role to the admin user
        $admin = User::where('email', 'super@admin.com')->first();
        if ($admin) {
            $admin->assignRole('Super Admin');
        }
    }
}

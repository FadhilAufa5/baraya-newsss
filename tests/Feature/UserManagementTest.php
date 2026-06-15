<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Database\Seeders\RoleAndPermissionSeeder;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

// --- Authentication & Authorization Checks ---

test('guests are redirected to the login page from user and role management', function () {
    $this->get(route('users.index'))->assertRedirect(route('login'));
    $this->get(route('roles.index'))->assertRedirect(route('login'));
});

test('unauthorized users without permissions are forbidden from user management', function () {
    // Create subscriber (has 'view news' but not 'manage users' or 'manage roles')
    $user = User::factory()->create();
    $user->assignRole('Subscriber');
    $this->actingAs($user);

    $this->get(route('users.index'))->assertStatus(403);
    $this->get(route('users.create'))->assertStatus(403);
    $this->post(route('users.store'), [])->assertStatus(403);
});

test('unauthorized users without permissions are forbidden from role management', function () {
    $user = User::factory()->create();
    $user->assignRole('Subscriber');
    $this->actingAs($user);

    $this->get(route('roles.index'))->assertStatus(403);
    $this->get(route('roles.create'))->assertStatus(403);
    $this->post(route('roles.store'), [])->assertStatus(403);
});

// --- User Management CRUD ---

test('super admin can view the user list', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $this->actingAs($admin);

    $this->get(route('users.index'))->assertOk();
});

test('super admin can create a new user and assign roles', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $this->actingAs($admin);

    $response = $this->post(route('users.store'), [
        'name' => 'New Writer',
        'email' => 'writer@baraya.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'roles' => ['Writer'],
    ]);

    $response->assertRedirect(route('users.index'));

    $user = User::where('email', 'writer@baraya.com')->first();
    expect($user)->not->toBeNull();
    expect($user->name)->toBe('New Writer');
    expect($user->hasRole('Writer'))->toBeTrue();
});

test('super admin can update a user and sync roles', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $this->actingAs($admin);

    $user = User::factory()->create();
    $user->assignRole('Subscriber');

    $response = $this->put(route('users.update', $user), [
        'name' => 'Updated Name',
        'email' => 'updated@email.com',
        'roles' => ['Editor'],
    ]);

    $response->assertRedirect(route('users.index'));

    $user->refresh();
    expect($user->name)->toBe('Updated Name');
    expect($user->email)->toBe('updated@email.com');
    expect($user->hasRole('Editor'))->toBeTrue();
    expect($user->hasRole('Subscriber'))->toBeFalse();
});

test('users cannot delete their own account', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $this->actingAs($admin);

    $response = $this->delete(route('users.destroy', $admin));
    $response->assertSessionHas('error', 'Tidak dapat menghapus akun sendiri.');
});

test('super admin can delete other users', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $this->actingAs($admin);

    $user = User::factory()->create();

    $response = $this->delete(route('users.destroy', $user));
    $response->assertRedirect(route('users.index'));

    expect(User::find($user->id))->toBeNull();
});

// --- Role Management CRUD ---

test('super admin can view the role list', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $this->actingAs($admin);

    $this->get(route('roles.index'))->assertOk();
});

test('super admin can create a new role with permissions', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $this->actingAs($admin);

    $response = $this->post(route('roles.store'), [
        'name' => 'News Moderator',
        'permissions' => ['create news', 'edit news', 'publish news'],
    ]);

    $response->assertRedirect(route('roles.index'));

    $role = Role::findByName('News Moderator');
    expect($role)->not->toBeNull();
    expect($role->hasPermissionTo('create news'))->toBeTrue();
    expect($role->hasPermissionTo('publish news'))->toBeTrue();
    expect($role->hasPermissionTo('manage users'))->toBeFalse();
});

test('super admin can update a role and permissions', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $this->actingAs($admin);

    $role = Role::create(['name' => 'Custom Role']);
    $role->givePermissionTo('view news');

    $response = $this->put(route('roles.update', $role), [
        'name' => 'Custom Role Updated',
        'permissions' => ['view news', 'create news'],
    ]);

    $response->assertRedirect(route('roles.index'));

    $role->refresh();
    expect($role->name)->toBe('Custom Role Updated');
    expect($role->hasPermissionTo('create news'))->toBeTrue();
});

test('super admin role cannot be deleted', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $this->actingAs($admin);

    $superAdminRole = Role::findByName('Super Admin');

    $response = $this->delete(route('roles.destroy', $superAdminRole));
    $response->assertSessionHas('error', 'Role Super Admin tidak dapat dihapus.');
});

test('super admin can delete other roles', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $this->actingAs($admin);

    $role = Role::create(['name' => 'Temporary Role']);

    $response = $this->delete(route('roles.destroy', $role));
    $response->assertRedirect(route('roles.index'));

    expect(Role::where('name', 'Temporary Role')->first())->toBeNull();
});

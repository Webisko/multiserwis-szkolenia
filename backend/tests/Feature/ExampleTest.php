<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_the_application_redirects_root_to_admin_dashboard(): void
    {
        $response = $this->get('/');

        $response->assertRedirect('/admin/kokpit');
    }
}

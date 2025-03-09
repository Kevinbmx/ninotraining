<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('telefonos_tutor', function (Blueprint $table) {
            $table->id();
            $table->uuid('unic_id')->unique();
            $table->foreignId('tutor_id')->constrained('tutores');
            $table->string('numeroTelefono');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('telefonos_tutor');
    }
};

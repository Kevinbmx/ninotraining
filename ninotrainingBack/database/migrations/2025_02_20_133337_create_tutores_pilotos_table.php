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
        Schema::create('tutores_pilotos', function (Blueprint $table) {
            $table->id();
            $table->uuid('unic_id')->unique();
            $table->string('parentesco');
            $table->foreignId('tutor_id')->constrained('tutores');
            $table->foreignId('piloto_id')->constrained('pilotos');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tutores_pilotos');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::table('damage_invoices', function (Blueprint $table) {
        $table->renameColumn('image', 'image_path');
    });
}

public function down()
{
    Schema::table('damage_invoices', function (Blueprint $table) {
        $table->renameColumn('image_path', 'image');
    });
}

};

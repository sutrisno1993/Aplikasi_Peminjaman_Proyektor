<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateProjectorTables extends Migration
{
    public function up()
    {
        // 1. Tabel Proyektor
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'code' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'model' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
            ],
            'bag_color' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'bag_color_hex' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'location' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['tersedia', 'dipinjam', 'maintenance'],
                'default'    => 'tersedia',
            ],
            'lamp_hours' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'default'    => '100 Jam',
            ],
            'last_maintenance' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'specs' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('proyektor', true);

        // 2. Tabel Guru (43 Guru)
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'nip' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'default'    => '-',
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
            ],
            'phone' => [
                'type'       => 'VARCHAR',
                'constraint' => 30,
                'default'    => '',
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['aktif', 'nonaktif'],
                'default'    => 'aktif',
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('guru', true);

        // 3. Tabel Kelas
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'grade' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'major' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'building' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'homeroom_teacher' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
                'default'    => '',
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('kelas', true);

        // 4. Tabel Peminjaman
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'unit_id' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'unit_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'teacher_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
            ],
            'destination_class' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'subject' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'default'    => 'PBM Multimedia',
            ],
            'duration_period' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'borrow_time' => [
                'type' => 'DATETIME',
            ],
            'return_time' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['aktif', 'selesai', 'maintenance'],
                'default'    => 'aktif',
            ],
            'checklist_borrow' => [
                'type' => 'JSON',
                'null' => true,
            ],
            'checklist_return' => [
                'type' => 'JSON',
                'null' => true,
            ],
            'condition_return' => [
                'type'       => 'ENUM',
                'constraint' => ['baik', 'perlu_perhatian', 'rusak'],
                'null'       => true,
            ],
            'complaints' => [
                'type' => 'JSON',
                'null' => true,
            ],
            'complaint_note' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'needs_direct_action' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'hours_used' => [
                'type'       => 'DECIMAL',
                'constraint' => '5,2',
                'default'    => 0.00,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('peminjaman', true);

        // 5. Tabel Komplain Sarpras
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'loan_id' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'unit_id' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'complaint_type' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'is_resolved' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],
            'resolved_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'resolved_by' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('komplain_sarpras', true);
    }

    public function down()
    {
        $this->forge->dropTable('komplain_sarpras', true);
        $this->forge->dropTable('peminjaman', true);
        $this->forge->dropTable('kelas', true);
        $this->forge->dropTable('guru', true);
        $this->forge->dropTable('proyektor', true);
    }
}

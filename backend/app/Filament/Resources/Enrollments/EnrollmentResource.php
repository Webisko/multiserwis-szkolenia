<?php

namespace App\Filament\Resources\Enrollments;

use App\Filament\Resources\Enrollments\Pages\CreateEnrollment;
use App\Filament\Resources\Enrollments\Pages\EditEnrollment;
use App\Filament\Resources\Enrollments\Pages\ListEnrollments;
use App\Models\Enrollment;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class EnrollmentResource extends Resource
{
    protected static ?string $model = Enrollment::class;

    protected static ?string $modelLabel = 'zapis kursanta';

    protected static ?string $pluralModelLabel = 'Zapisy kursantów (LMS)';

    protected static ?string $navigationLabel = 'Zapisy na kursy';

    protected static ?string $slug = 'zapisy-kursantow';

    protected static ?int $navigationSort = 50;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentCheck;

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::query()->where('status', 'ACTIVE')->count();
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Przypisanie kursanta do szkolenia')
                ->columns(2)
                ->schema([
                    Select::make('user_id')
                        ->relationship('user', 'name')
                        ->label('Kursant')
                        ->required()
                        ->searchable()
                        ->preload(),
                    Select::make('course_id')
                        ->relationship('course', 'title')
                        ->label('Szkolenie')
                        ->required()
                        ->searchable()
                        ->preload(),
                    Select::make('status')
                        ->label('Status dostępu')
                        ->options([
                            'ACTIVE' => 'Aktywny',
                            'COMPLETED' => 'Ukończony (zdany egzamin)',
                            'PAUSED' => 'Wstrzymany',
                            'EXPIRED' => 'Wygasły',
                        ])
                        ->required()
                        ->default('ACTIVE'),
                    TextInput::make('progress')
                        ->label('Postęp kursu (%)')
                        ->numeric()
                        ->minValue(0)
                        ->maxValue(100)
                        ->default(0)
                        ->required(),
                    TextInput::make('next_lesson')
                        ->label('Aktualna / następna lekcja')
                        ->maxLength(255),
                    TextInput::make('certificate_number')
                        ->label('Numer wydanego zaświadczenia / certyfikatu')
                        ->placeholder('np. MS/UDT/2026/0105')
                        ->maxLength(64),
                    DateTimePicker::make('expires_at')
                        ->label('Data ważności dostępu LMS'),
                    DateTimePicker::make('completed_at')
                        ->label('Data ukończenia szkolenia'),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('Kursant')
                    ->weight('bold')
                    ->searchable()
                    ->description(fn (Enrollment $record): string => (string) ($record->user?->company_name ?: $record->user?->email)),
                TextColumn::make('course.title')
                    ->label('Szkolenie')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge(),
                TextColumn::make('progress')
                    ->label('Postęp')
                    ->suffix('%')
                    ->sortable(),
                TextColumn::make('certificate_number')
                    ->label('Certyfikat')
                    ->placeholder('—'),
                TextColumn::make('expires_at')
                    ->label('Ważny do')
                    ->dateTime('d.m.Y')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'ACTIVE' => 'Aktywny',
                        'COMPLETED' => 'Ukończony',
                        'PAUSED' => 'Wstrzymany',
                        'EXPIRED' => 'Wygasły',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                DeleteBulkAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListEnrollments::route('/'),
            'create' => CreateEnrollment::route('/create'),
            'edit' => EditEnrollment::route('/{record}/edit'),
        ];
    }
}

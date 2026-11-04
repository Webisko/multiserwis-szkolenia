<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $modelLabel = 'użytkownik';

    protected static ?string $pluralModelLabel = 'Użytkownicy i konta LMS';

    protected static ?string $navigationLabel = 'Użytkownicy';

    protected static ?string $slug = 'uzytkownicy';

    protected static ?int $navigationSort = 90;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    public static function canAccess(): bool
    {
        return strtoupper((string) auth()->user()?->role) === 'ADMIN';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Dane konta użytkownika')
                ->columns(2)
                ->schema([
                    TextInput::make('name')
                        ->label('Imię i nazwisko')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('email')
                        ->label('Adres e-mail (login)')
                        ->email()
                        ->required()
                        ->maxLength(255)
                        ->unique(ignoreRecord: true, modifyRuleUsing: fn ($rule) => $rule->whereNull('deleted_at')),
                    TextInput::make('phone')
                        ->label('Telefon kontaktowy')
                        ->maxLength(64),
                    Select::make('role')
                        ->label('Rola w systemie')
                        ->options([
                            'STUDENT' => 'Kursant (Strefa LMS)',
                            'COMPANY_GUARDIAN' => 'Opiekun Firmy B2B',
                            'MANAGER' => 'Menedżer Szkoleń (Panel CMS)',
                            'ADMIN' => 'Administrator (Pełny dostęp)',
                        ])
                        ->required()
                        ->default('STUDENT'),
                    TextInput::make('company_name')
                        ->label('Nazwa firmy (dla kursantów i opiekunów B2B)')
                        ->maxLength(255),
                    TextInput::make('company_nip')
                        ->label('NIP firmy')
                        ->maxLength(32),
                    TextInput::make('job_title')
                        ->label('Stanowisko')
                        ->maxLength(255),
                    TextInput::make('password')
                        ->label('Hasło dostępu')
                        ->password()
                        ->dehydrated(fn ($state) => filled($state))
                        ->required(fn (string $operation): bool => $operation === 'create')
                        ->helperText('Przy edycji pozostaw puste, jeśli nie chcesz zmieniać hasła.'),
                    Toggle::make('is_active')
                        ->label('Konto aktywne')
                        ->default(true),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Imię i nazwisko')
                    ->weight('bold')
                    ->searchable()
                    ->description(fn (User $record): string => (string) $record->email),
                TextColumn::make('role')
                    ->label('Rola')
                    ->badge(),
                TextColumn::make('company_name')
                    ->label('Firma')
                    ->searchable()
                    ->placeholder('Indywidualny'),
                TextColumn::make('phone')
                    ->label('Telefon'),
                ToggleColumn::make('is_active')
                    ->label('Aktywny'),
                TextColumn::make('created_at')
                    ->label('Utworzono')
                    ->dateTime('d.m.Y')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('role')
                    ->label('Rola')
                    ->options([
                        'STUDENT' => 'Kursant',
                        'COMPANY_GUARDIAN' => 'Opiekun Firmy B2B',
                        'MANAGER' => 'Menedżer Szkoleń',
                        'ADMIN' => 'Administrator',
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
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}

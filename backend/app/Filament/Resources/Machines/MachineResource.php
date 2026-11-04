<?php

namespace App\Filament\Resources\Machines;

use App\Filament\Resources\Machines\Pages\CreateMachine;
use App\Filament\Resources\Machines\Pages\EditMachine;
use App\Filament\Resources\Machines\Pages\ListMachines;
use App\Models\Machine;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class MachineResource extends Resource
{
    protected static ?string $model = Machine::class;

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $modelLabel = 'maszyna';

    protected static ?string $pluralModelLabel = 'Maszyny na wynajem';

    protected static ?string $navigationLabel = 'Flota maszyn';

    protected static ?string $slug = 'maszyny';

    protected static ?int $navigationSort = 40;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTruck;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Parametry techniczne maszyny')
                ->columns(2)
                ->schema([
                    TextInput::make('name')
                        ->label('Nazwa i model maszyny')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('slug')
                        ->label('Adres URL (slug)')
                        ->required()
                        ->maxLength(255)
                        ->unique(ignoreRecord: true, modifyRuleUsing: fn ($rule) => $rule->whereNull('deleted_at')),
                    TextInput::make('code')
                        ->label('Kod maszyny (np. m1)')
                        ->required()
                        ->maxLength(32)
                        ->unique(ignoreRecord: true, modifyRuleUsing: fn ($rule) => $rule->whereNull('deleted_at')),
                    TextInput::make('type')
                        ->label('Typ urządzenia')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('height')
                        ->label('Wysokość robocza')
                        ->placeholder('np. 21 m')
                        ->maxLength(64),
                    TextInput::make('capacity')
                        ->label('Udźwig / pojemność')
                        ->placeholder('np. 5 000 kg')
                        ->maxLength(64),
                    TextInput::make('weight')
                        ->label('Masa własna')
                        ->placeholder('np. 16 400 kg')
                        ->maxLength(64),
                    TextInput::make('daily_price_net')
                        ->label('Orientacyjna stawka dobowa netto (PLN)')
                        ->numeric(),
                    TextInput::make('sort_order')
                        ->label('Kolejność wyświetlania')
                        ->numeric()
                        ->default(10)
                        ->required(),
                    Toggle::make('is_active')
                        ->label('Dostępna w katalogu wynajmu')
                        ->default(true),
                    Textarea::make('description')
                        ->label('Opis maszyny i zastosowania')
                        ->rows(4)
                        ->columnSpanFull(),
                    FileUpload::make('image')
                        ->label('Zdjęcie maszyny (automatyczna konwersja do WebP)')
                        ->disk('public')
                        ->directory('uploads/machines')
                        ->visibility('public')
                        ->image()
                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
                        ->maxSize(5120)
                        ->columnSpanFull(),
                ])
                ->columnSpanFull(),
            Section::make('SEO i udostępnianie')
                ->columns(2)
                ->schema([
                    TextInput::make('meta_title')
                        ->label('Tytuł SEO (meta title)')
                        ->maxLength(255),
                    TextInput::make('og_image')
                        ->label('Ścieżka obrazka OpenGraph')
                        ->maxLength(255),
                    Textarea::make('meta_description')
                        ->label('Opis SEO (meta description)')
                        ->rows(2)
                        ->columnSpanFull(),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sort_order')
                    ->label('#')
                    ->sortable()
                    ->width('55px'),
                TextColumn::make('name')
                    ->label('Maszyna')
                    ->weight('bold')
                    ->searchable(),
                TextColumn::make('type')
                    ->label('Typ'),
                TextColumn::make('height')
                    ->label('Wysokość'),
                TextColumn::make('capacity')
                    ->label('Udźwig'),
                TextColumn::make('weight')
                    ->label('Masa'),
                ToggleColumn::make('is_active')
                    ->label('Aktywna'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                DeleteBulkAction::make(),
            ])
            ->reorderable('sort_order')
            ->defaultSort('sort_order');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListMachines::route('/'),
            'create' => CreateMachine::route('/create'),
            'edit' => EditMachine::route('/{record}/edit'),
        ];
    }
}

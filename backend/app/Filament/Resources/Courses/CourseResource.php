<?php

namespace App\Filament\Resources\Courses;

use App\Filament\Resources\Courses\Pages\CreateCourse;
use App\Filament\Resources\Courses\Pages\EditCourse;
use App\Filament\Resources\Courses\Pages\ListCourses;
use App\Models\Course;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class CourseResource extends Resource
{
    protected static ?string $model = Course::class;

    protected static ?string $recordTitleAttribute = 'title';

    protected static ?string $modelLabel = 'szkolenie';

    protected static ?string $pluralModelLabel = 'Szkolenia';

    protected static ?string $navigationLabel = 'Szkolenia';

    protected static ?string $slug = 'szkolenia';

    protected static ?int $navigationSort = 10;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAcademicCap;

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::query()->where('is_active', true)->count();
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('KursTabs')
                ->tabs([
                    Tab::make('Informacje podstawowe')
                        ->schema([
                            Section::make('Dane główne szkolenia')
                                ->columns(2)
                                ->schema([
                                    TextInput::make('title')
                                        ->label('Nazwa szkolenia')
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('slug')
                                        ->label('Adres URL (slug)')
                                        ->required()
                                        ->maxLength(255)
                                        ->unique(ignoreRecord: true, modifyRuleUsing: fn ($rule) => $rule->whereNull('deleted_at')),
                                    TextInput::make('code')
                                        ->label('Kod kursu (np. c1)')
                                        ->required()
                                        ->maxLength(32)
                                        ->unique(ignoreRecord: true, modifyRuleUsing: fn ($rule) => $rule->whereNull('deleted_at')),
                                    Select::make('category')
                                        ->label('Kategoria uprawnień')
                                        ->options([
                                            'UDT' => 'UDT (Urząd Dozoru Technicznego)',
                                            'IMBiGS' => 'IMBiGS / ŚBŁ-WIT (Maszyny budowlane)',
                                            'SEP' => 'SEP (Uprawnienia energetyczne G1/G2/G3)',
                                            'Spawalnictwo' => 'Spawalnictwo (MIG/MAG, TIG, MMA)',
                                            'Inne' => 'BHP i specjalistyczne (Inne)',
                                        ])
                                        ->required()
                                        ->default('UDT'),
                                    TextInput::make('duration')
                                        ->label('Czas trwania')
                                        ->required()
                                        ->default('35 godz.')
                                        ->maxLength(64),
                                    TextInput::make('price_gross')
                                        ->label('Cena brutto (PLN)')
                                        ->numeric()
                                        ->required()
                                        ->default(1000),
                                    TextInput::make('promo_price_gross')
                                        ->label('Cena promocyjna brutto (opcjonalnie)')
                                        ->numeric(),
                                    TextInput::make('price_label')
                                        ->label('Etykieta ceny na karcie (np. 1 000 zł)')
                                        ->required()
                                        ->default('1 000 zł')
                                        ->maxLength(64),
                                    TextInput::make('exam_body')
                                        ->label('Komisja egzaminacyjna')
                                        ->placeholder('np. Komisja UDT / ŚBŁ-WIT / SEP')
                                        ->maxLength(120),
                                    TextInput::make('validity_period')
                                        ->label('Okres ważności uprawnień')
                                        ->placeholder('np. 5 lat / 10 lat / Bezterminowo')
                                        ->maxLength(64),
                                    TextInput::make('sort_order')
                                        ->label('Kolejność wyświetlania')
                                        ->numeric()
                                        ->default(10)
                                        ->required(),
                                ]),
                            Section::make('Tryb realizacji i widoczność')
                                ->columns(4)
                                ->schema([
                                    Toggle::make('is_active')
                                        ->label('Aktywne w katalogu')
                                        ->default(false)
                                        ->helperText('Domyślnie szkic – włącz po uzupełnieniu materiałów i programu szkolenia.'),
                                    Toggle::make('is_popular')
                                        ->label('Wyróżnione (Popularne)')
                                        ->default(false),
                                    Toggle::make('has_stationary')
                                        ->label('Zajęcia stacjonarne (Kutno)')
                                        ->default(true),
                                    Toggle::make('has_online')
                                        ->label('Dostępny e-learning (LMS)')
                                        ->default(false),
                                ]),
                            Section::make('Opisy i program szkolenia')
                                ->schema([
                                    Textarea::make('short_description')
                                        ->label('Krótki opis na karcie kursu')
                                        ->rows(3)
                                        ->maxLength(600),
                                    RichEditor::make('description')
                                        ->label('Pełny opis szkolenia')
                                        ->columnSpanFull(),
                                    Textarea::make('syllabus')
                                        ->label('Program ramowy szkolenia (każdy punkt w nowej linii)')
                                        ->rows(7)
                                        ->formatStateUsing(fn ($state): string => is_array($state) ? implode(PHP_EOL, $state) : (string) $state)
                                        ->dehydrateStateUsing(fn ($state): array => collect(preg_split('/\r\n|\r|\n/', (string) $state))
                                            ->map(fn ($line): string => trim((string) $line))
                                            ->filter()
                                            ->values()
                                            ->all())
                                        ->columnSpanFull(),
                                    FileUpload::make('image')
                                        ->label('Zdjęcie główne szkolenia (automatyczna konwersja do WebP)')
                                        ->disk('public')
                                        ->directory('uploads/courses')
                                        ->visibility('public')
                                        ->image()
                                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
                                        ->maxSize(5120)
                                        ->helperText('Możesz wgrać nowe zdjęcie lub pozostawić ścieżkę systemową (np. /operator-wozki-widlowe.webp).'),
                                ]),
                        ]),
                    Tab::make('Moduły e-learningowe')
                        ->schema([
                            Repeater::make('modules')
                                ->relationship('modules')
                                ->label('Moduły kursu w strefie LMS')
                                ->orderColumn('sort_order')
                                ->reorderable()
                                ->columns(2)
                                ->schema([
                                    TextInput::make('title')
                                        ->label('Tytuł modułu')
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('code')
                                        ->label('Kod modułu')
                                        ->placeholder('np. c1m1')
                                        ->maxLength(64),
                                    Textarea::make('description')
                                        ->label('Opis modułu')
                                        ->rows(2)
                                        ->columnSpanFull(),
                                    Toggle::make('is_active')
                                        ->label('Moduł aktywny')
                                        ->default(true),
                                ]),
                        ]),
                    Tab::make('SEO i udostępnianie')
                        ->schema([
                            Section::make('Parametry meta i OpenGraph')
                                ->schema([
                                    TextInput::make('meta_title')
                                        ->label('Tytuł SEO (meta title)')
                                        ->maxLength(255)
                                        ->helperText('Pozostaw puste, aby wygenerować automatycznie z nazwy szkolenia.'),
                                    Textarea::make('meta_description')
                                        ->label('Opis SEO (meta description)')
                                        ->rows(3)
                                        ->maxLength(320),
                                    FileUpload::make('og_image')
                                        ->label('Obrazek OpenGraph (1200x630)')
                                        ->disk('public')
                                        ->directory('uploads/seo')
                                        ->visibility('public')
                                        ->image()
                                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
                                        ->maxSize(5120),
                                ]),
                        ]),
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
                TextColumn::make('code')
                    ->label('Kod')
                    ->badge()
                    ->color('gray')
                    ->searchable(),
                TextColumn::make('title')
                    ->label('Szkolenie')
                    ->weight('bold')
                    ->searchable()
                    ->sortable()
                    ->description(fn (Course $record): string => 'Slug: /szkolenia/'.$record->slug),
                TextColumn::make('category')
                    ->label('Kategoria')
                    ->badge()
                    ->sortable(),
                TextColumn::make('duration')
                    ->label('Czas'),
                TextColumn::make('price_label')
                    ->label('Cena')
                    ->weight('bold'),
                ToggleColumn::make('is_popular')
                    ->label('Popularne'),
                ToggleColumn::make('has_online')
                    ->label('E-learning'),
                ToggleColumn::make('is_active')
                    ->label('Aktywne'),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->label('Kategoria')
                    ->options([
                        'UDT' => 'UDT',
                        'IMBiGS' => 'IMBiGS',
                        'SEP' => 'SEP',
                        'Spawalnictwo' => 'Spawalnictwo',
                        'Inne' => 'Inne',
                    ]),
                TernaryFilter::make('is_active')
                    ->label('Aktywne'),
                TernaryFilter::make('has_online')
                    ->label('Z e-learningiem'),
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
            'index' => ListCourses::route('/'),
            'create' => CreateCourse::route('/create'),
            'edit' => EditCourse::route('/{record}/edit'),
        ];
    }
}

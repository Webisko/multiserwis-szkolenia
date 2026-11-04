<?php

namespace App\Filament\Resources\ExamQuestions;

use App\Filament\Resources\ExamQuestions\Pages\CreateExamQuestion;
use App\Filament\Resources\ExamQuestions\Pages\EditExamQuestion;
use App\Filament\Resources\ExamQuestions\Pages\ListExamQuestions;
use App\Models\ExamQuestion;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
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

class ExamQuestionResource extends Resource
{
    protected static ?string $model = ExamQuestion::class;

    protected static ?string $recordTitleAttribute = 'question';

    protected static ?string $modelLabel = 'pytanie egzaminacyjne';

    protected static ?string $pluralModelLabel = 'Baza pytań testowych';

    protected static ?string $navigationLabel = 'Baza pytań';

    protected static ?string $slug = 'baza-pytan';

    protected static ?int $navigationSort = 30;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQuestionMarkCircle;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Treść i parametry pytania egzaminacyjnego')
                ->columns(2)
                ->schema([
                    Select::make('course_id')
                        ->relationship('course', 'title')
                        ->label('Przypisane szkolenie')
                        ->required()
                        ->searchable()
                        ->preload(),
                    Select::make('course_module_id')
                        ->relationship('module', 'title')
                        ->label('Moduł (opcjonalnie)')
                        ->searchable()
                        ->preload(),
                    Select::make('type')
                        ->label('Typ pytania')
                        ->options([
                            'SINGLE_CHOICE' => 'Jednokrotnego wyboru',
                            'MULTIPLE_CHOICE' => 'Wielokrotnego wyboru',
                            'OPEN' => 'Pytanie otwarte',
                        ])
                        ->required()
                        ->default('SINGLE_CHOICE'),
                    Select::make('difficulty')
                        ->label('Poziom trudności')
                        ->options([
                            'EASY' => 'Podstawowy',
                            'MEDIUM' => 'Średniozaawansowany',
                            'HARD' => 'Zaawansowany (Egzamin UDT)',
                        ])
                        ->required()
                        ->default('MEDIUM'),
                    Textarea::make('question')
                        ->label('Treść pytania')
                        ->rows(3)
                        ->required()
                        ->columnSpanFull(),
                    Textarea::make('options')
                        ->label('Warianty odpowiedzi (każda odpowiedź w osobnej linii, indeksowane od 0)')
                        ->rows(5)
                        ->formatStateUsing(fn ($state): string => is_array($state) ? implode(PHP_EOL, $state) : (string) $state)
                        ->dehydrateStateUsing(fn ($state): array => collect(preg_split('/\r\n|\r|\n/', (string) $state))
                            ->map(fn ($line): string => trim((string) $line))
                            ->filter()
                            ->values()
                            ->all())
                        ->columnSpanFull(),
                    TextInput::make('correct_answer')
                        ->label('Poprawne indeksy odpowiedzi (np. 1 lub 0,2,3)')
                        ->formatStateUsing(fn ($state): string => is_array($state) ? implode(',', $state) : (string) $state)
                        ->dehydrateStateUsing(fn ($state): array => collect(explode(',', (string) $state))
                            ->map(fn ($v) => trim($v))
                            ->filter(fn ($v) => $v !== '')
                            ->map(fn ($v) => is_numeric($v) ? (int) $v : $v)
                            ->values()
                            ->all()),
                    TextInput::make('sort_order')
                        ->label('Kolejność wyświetlania')
                        ->numeric()
                        ->default(10),
                    Textarea::make('explanation')
                        ->label('Wyjaśnienie merytoryczne poprawnej odpowiedzi')
                        ->rows(3)
                        ->columnSpanFull(),
                    Toggle::make('is_active')
                        ->label('Aktywne w puli egzaminacyjnej')
                        ->default(true),
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
                TextColumn::make('question')
                    ->label('Pytanie')
                    ->limit(80)
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('course.title')
                    ->label('Szkolenie')
                    ->sortable(),
                TextColumn::make('type')
                    ->label('Typ')
                    ->badge(),
                TextColumn::make('difficulty')
                    ->label('Poziom')
                    ->badge(),
                ToggleColumn::make('is_active')
                    ->label('Aktywne'),
            ])
            ->filters([
                SelectFilter::make('course_id')
                    ->relationship('course', 'title')
                    ->label('Szkolenie'),
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
            'index' => ListExamQuestions::route('/'),
            'create' => CreateExamQuestion::route('/create'),
            'edit' => EditExamQuestion::route('/{record}/edit'),
        ];
    }
}

<?php

namespace App\Filament\Resources\CourseLessons;

use App\Filament\Resources\CourseLessons\Pages\CreateCourseLesson;
use App\Filament\Resources\CourseLessons\Pages\EditCourseLesson;
use App\Filament\Resources\CourseLessons\Pages\ListCourseLessons;
use App\Models\CourseLesson;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
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

class CourseLessonResource extends Resource
{
    protected static ?string $model = CourseLesson::class;

    protected static ?string $recordTitleAttribute = 'title';

    protected static ?string $modelLabel = 'lekcja';

    protected static ?string $pluralModelLabel = 'Lekcje e-learningowe';

    protected static ?string $navigationLabel = 'Lekcje LMS';

    protected static ?string $slug = 'lekcje-lms';

    protected static ?int $navigationSort = 20;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPlayCircle;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Dane lekcji')
                ->columns(2)
                ->schema([
                    Select::make('course_id')
                        ->relationship('course', 'title')
                        ->label('Szkolenie')
                        ->required()
                        ->searchable()
                        ->preload(),
                    Select::make('course_module_id')
                        ->relationship('module', 'title')
                        ->label('Moduł kursu')
                        ->required()
                        ->searchable()
                        ->preload(),
                    TextInput::make('title')
                        ->label('Tytuł lekcji')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('code')
                        ->label('Kod lekcji (np. c1l1)')
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->maxLength(64),
                    Select::make('type')
                        ->label('Typ lekcji')
                        ->options([
                            'video' => 'Wideo szkoleniowe (HLS / MP4)',
                            'text' => 'Materiał tekstowy / konspekt',
                            'test' => 'Test wiedzy / egzamin próbny',
                            'quiz' => 'Quiz końcowy',
                        ])
                        ->required()
                        ->default('video'),
                    TextInput::make('duration')
                        ->label('Czas trwania / liczba pytań')
                        ->required()
                        ->default('15:00')
                        ->maxLength(64),
                    TextInput::make('video_url')
                        ->label('Zewnętrzny adres wideo (HLS .m3u8 lub MP4)')
                        ->maxLength(255),
                    TextInput::make('sort_order')
                        ->label('Kolejność w module')
                        ->numeric()
                        ->default(10)
                        ->required(),
                    FileUpload::make('digital_file_path')
                        ->label('Prywatny plik cyfrowy dla kursanta (PDF / materiał LMS)')
                        ->disk('local')
                        ->directory('private/digital-products')
                        ->visibility('private')
                        ->maxSize(51200)
                        ->helperText('Plik zapisywany na dysku prywatnym poza public_html — dostępny wyłącznie dla opłaconych kursantów.')
                        ->columnSpanFull(),
                    RichEditor::make('content')
                        ->label('Treść merytoryczna lekcji')
                        ->columnSpanFull(),
                    Toggle::make('is_active')
                        ->label('Lekcja aktywna')
                        ->default(true),
                    Toggle::make('is_locked')
                        ->label('Zablokowana do ukończenia poprzedniej')
                        ->default(false),
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
                    ->color('gray'),
                TextColumn::make('title')
                    ->label('Tytuł lekcji')
                    ->weight('bold')
                    ->searchable(),
                TextColumn::make('course.title')
                    ->label('Szkolenie')
                    ->sortable(),
                TextColumn::make('module.title')
                    ->label('Moduł'),
                TextColumn::make('type')
                    ->label('Typ')
                    ->badge(),
                TextColumn::make('duration')
                    ->label('Czas'),
                ToggleColumn::make('is_active')
                    ->label('Aktywna'),
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
            'index' => ListCourseLessons::route('/'),
            'create' => CreateCourseLesson::route('/create'),
            'edit' => EditCourseLesson::route('/{record}/edit'),
        ];
    }
}

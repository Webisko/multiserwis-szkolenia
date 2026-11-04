<?php

namespace App\Filament\Resources\SiteSettings;

use App\Filament\Resources\SiteSettings\Pages\EditSiteSetting;
use App\Models\SiteSetting;
use BackedEnum;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class SiteSettingResource extends Resource
{
    protected static ?string $model = SiteSetting::class;

    protected static ?string $modelLabel = 'ustawienia ośrodka';

    protected static ?string $pluralModelLabel = 'Ustawienia ośrodka i SEO';

    protected static ?string $navigationLabel = 'Ustawienia strony';

    protected static ?string $slug = 'ustawienia-strony';

    protected static ?int $navigationSort = 100;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    public static function canAccess(): bool
    {
        return strtoupper((string) auth()->user()?->role) === 'ADMIN';
    }

    public static function getNavigationUrl(): string
    {
        $record = SiteSetting::current();

        return static::getUrl('edit', ['record' => $record]);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Dane teleadresowe Ośrodka Szkolenia Kadr MultiSerwis')
                ->columns(2)
                ->schema([
                    TextInput::make('site_name')
                        ->label('Nazwa ośrodka szkoleniowego')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('company_legal_name')
                        ->label('Pełna nazwa rejestrowa spółki')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('company_nip')
                        ->label('NIP spółki')
                        ->required()
                        ->maxLength(32),
                    TextInput::make('phone_training')
                        ->label('Główny telefon działu szkoleń')
                        ->required()
                        ->maxLength(64),
                    TextInput::make('phone_training_secondary')
                        ->label('Drugi telefon działu szkoleń')
                        ->maxLength(64),
                    TextInput::make('phone_rental')
                        ->label('Telefon działu wynajmu i dźwigów')
                        ->maxLength(64),
                    TextInput::make('email_office')
                        ->label('E-mail biura (nadawca SMTP)')
                        ->email()
                        ->required()
                        ->maxLength(255),
                    TextInput::make('email_notifications')
                        ->label('E-mail odbiorczy powiadomień o zapisach')
                        ->email()
                        ->required()
                        ->maxLength(255),
                    TextInput::make('office_address')
                        ->label('Adres biura i sali wykładowej')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('training_ground_address')
                        ->label('Adres bazy i placu manewrowego')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('opening_hours')
                        ->label('Godziny otwarcia biura')
                        ->maxLength(120),
                    TextInput::make('facebook_url')
                        ->label('Adres profilu Facebook')
                        ->maxLength(255),
                    TextInput::make('top_bar_badge')
                        ->label('Komunikat wyróżniony na stronie głównej')
                        ->maxLength(255)
                        ->columnSpanFull(),
                ])
                ->columnSpanFull(),
            Section::make('SEO i udostępnianie (ustawienia domyślne)')
                ->schema([
                    TextInput::make('meta_title')
                        ->label('Domyślny tytuł strony (meta title)')
                        ->maxLength(255),
                    Textarea::make('meta_description')
                        ->label('Domyślny opis strony (meta description)')
                        ->rows(3)
                        ->maxLength(320),
                    FileUpload::make('default_og_image')
                        ->label('Domyślna grafika OpenGraph (1200x630)')
                        ->disk('public')
                        ->directory('uploads/seo')
                        ->visibility('public')
                        ->image()
                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
                        ->maxSize(5120),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => EditSiteSetting::route('/'),
            'edit' => EditSiteSetting::route('/{record}/edit'),
        ];
    }
}

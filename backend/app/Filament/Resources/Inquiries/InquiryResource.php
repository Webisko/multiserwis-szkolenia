<?php

namespace App\Filament\Resources\Inquiries;

use App\Filament\Resources\Inquiries\Pages\EditInquiry;
use App\Filament\Resources\Inquiries\Pages\ListInquiries;
use App\Models\Inquiry;
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
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class InquiryResource extends Resource
{
    protected static ?string $model = Inquiry::class;

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $modelLabel = 'zapytanie ze strony';

    protected static ?string $pluralModelLabel = 'Zapytania i zapisy z formularzy';

    protected static ?string $navigationLabel = 'Zapytania ofertowe';

    protected static ?string $slug = 'zapytania-ofertowe';

    protected static ?int $navigationSort = 70;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedEnvelope;

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::query()->where('status', 'NEW')->where('is_spam', false)->count();

        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Dane zgłoszenia ze strony')
                ->columns(2)
                ->schema([
                    TextInput::make('name')
                        ->label('Imię i nazwisko / Firma')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('phone')
                        ->label('Telefon kontaktowy')
                        ->maxLength(64),
                    TextInput::make('email')
                        ->label('Adres e-mail')
                        ->email()
                        ->maxLength(255),
                    TextInput::make('company')
                        ->label('Nazwa firmy (B2B)')
                        ->maxLength(255),
                    TextInput::make('nip')
                        ->label('NIP')
                        ->maxLength(32),
                    Select::make('inquiry_type')
                        ->label('Typ zgłoszenia')
                        ->options([
                            'INDYWIDUALNY' => 'Zapis indywidualny na kurs',
                            'B2B' => 'Zapis firmowy B2B / KFS',
                            'WYNAJEM' => 'Wynajem maszyny',
                            'SERWIS' => 'Serwis techniczny',
                            'KONTAKT' => 'Zapytanie ogólne',
                        ])
                        ->default('KONTAKT'),
                    TextInput::make('subject')
                        ->label('Temat zgłoszenia')
                        ->maxLength(255),
                    Select::make('status')
                        ->label('Status obsługi')
                        ->options([
                            'NEW' => 'Nowe (do kontaktu)',
                            'IN_PROGRESS' => 'W trakcie obsługi',
                            'DONE' => 'Zrealizowane / Zapisano',
                            'ARCHIVED' => 'Zarchiwizowane',
                        ])
                        ->required()
                        ->default('NEW'),
                    Textarea::make('message')
                        ->label('Treść wiadomości / wybrany kurs')
                        ->rows(5)
                        ->columnSpanFull(),
                    Textarea::make('admin_notes')
                        ->label('Notatki biura MultiSerwis')
                        ->rows(3)
                        ->columnSpanFull(),
                    Toggle::make('is_spam')
                        ->label('Oznacz jako SPAM')
                        ->default(false),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Zgłaszający')
                    ->weight('bold')
                    ->searchable()
                    ->description(fn (Inquiry $record): string => (string) ($record->email.' • '.$record->phone)),
                TextColumn::make('inquiry_type')
                    ->label('Typ')
                    ->badge(),
                TextColumn::make('subject')
                    ->label('Temat / Kurs')
                    ->limit(50)
                    ->searchable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge(),
                TextColumn::make('created_at')
                    ->label('Data wpływu')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'NEW' => 'Nowe',
                        'IN_PROGRESS' => 'W trakcie',
                        'DONE' => 'Zrealizowane',
                        'ARCHIVED' => 'Zarchiwizowane',
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
            'index' => ListInquiries::route('/'),
            'edit' => EditInquiry::route('/{record}/edit'),
        ];
    }
}

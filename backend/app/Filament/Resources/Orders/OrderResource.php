<?php

namespace App\Filament\Resources\Orders;

use App\Filament\Resources\Orders\Pages\CreateOrder;
use App\Filament\Resources\Orders\Pages\EditOrder;
use App\Filament\Resources\Orders\Pages\ListOrders;
use App\Models\Order;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $recordTitleAttribute = 'order_number';

    protected static ?string $modelLabel = 'zamówienie';

    protected static ?string $pluralModelLabel = 'Zamówienia szkoleń';

    protected static ?string $navigationLabel = 'Zamówienia';

    protected static ?string $slug = 'zamowienia';

    protected static ?int $navigationSort = 60;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShoppingCart;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Szczegóły zamówienia')
                ->columns(2)
                ->schema([
                    TextInput::make('order_number')
                        ->label('Numer zamówienia')
                        ->disabled()
                        ->dehydrated(false),
                    TextInput::make('public_token')
                        ->label('Publiczny token zamówienia (UUID)')
                        ->disabled()
                        ->dehydrated(false),
                    Select::make('user_id')
                        ->relationship('user', 'name')
                        ->label('Konto użytkownika')
                        ->searchable()
                        ->preload(),
                    Select::make('course_id')
                        ->relationship('course', 'title')
                        ->label('Szkolenie z katalogu')
                        ->searchable()
                        ->preload(),
                    TextInput::make('course_name')
                        ->label('Nazwa szkolenia na zamówieniu (snapshot)')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('amount_gross')
                        ->label('Kwota brutto (PLN, zw. z VAT)')
                        ->numeric()
                        ->required(),
                    TextInput::make('customer_name')
                        ->label('Imię i nazwisko zamawiającego')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('customer_email')
                        ->label('Adres e-mail')
                        ->email()
                        ->required()
                        ->maxLength(255),
                    TextInput::make('customer_phone')
                        ->label('Telefon')
                        ->maxLength(64),
                    TextInput::make('company_name')
                        ->label('Nazwa firmy (B2B)')
                        ->maxLength(255),
                    TextInput::make('company_nip')
                        ->label('NIP firmy')
                        ->maxLength(32),
                    Select::make('status')
                        ->label('Status płatności / zamówienia')
                        ->options([
                            'DRAFT' => 'Szkic',
                            'PENDING_PAYMENT' => 'Oczekuje na płatność',
                            'PAID' => 'Opłacone',
                            'CANCELLED' => 'Anulowane',
                            'FAILED' => 'Błąd płatności',
                        ])
                        ->required()
                        ->default('PENDING_PAYMENT'),
                    Textarea::make('notes')
                        ->label('Notatki wewnętrzne')
                        ->rows(3)
                        ->columnSpanFull(),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_number')
                    ->label('Numer')
                    ->weight('bold')
                    ->searchable(),
                TextColumn::make('customer_name')
                    ->label('Klient')
                    ->searchable()
                    ->description(fn (Order $record): string => (string) ($record->company_name ?: $record->customer_email)),
                TextColumn::make('course_name')
                    ->label('Szkolenie')
                    ->searchable(),
                TextColumn::make('amount_gross')
                    ->label('Kwota')
                    ->suffix(' PLN')
                    ->weight('bold'),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge(),
                TextColumn::make('created_at')
                    ->label('Data')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'PENDING_PAYMENT' => 'Oczekuje na płatność',
                        'PAID' => 'Opłacone',
                        'CANCELLED' => 'Anulowane',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListOrders::route('/'),
            'create' => CreateOrder::route('/create'),
            'edit' => EditOrder::route('/{record}/edit'),
        ];
    }
}

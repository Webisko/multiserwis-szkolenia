<?php

namespace App\Filament\Resources\Tickets;

use App\Filament\Resources\Tickets\Pages\EditTicket;
use App\Filament\Resources\Tickets\Pages\ListTickets;
use App\Models\Ticket;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Repeater;
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

class TicketResource extends Resource
{
    protected static ?string $model = Ticket::class;

    protected static ?string $recordTitleAttribute = 'subject';

    protected static ?string $modelLabel = 'zgłoszenie wsparcia';

    protected static ?string $pluralModelLabel = 'Zgłoszenia wsparcia technicznego';

    protected static ?string $navigationLabel = 'Wsparcie LMS';

    protected static ?string $slug = 'zgloszenia-wsparcia';

    protected static ?int $navigationSort = 80;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedLifebuoy;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Szczegóły zgłoszenia kursanta')
                ->columns(2)
                ->schema([
                    TextInput::make('ticket_number')
                        ->label('Numer zgłoszenia')
                        ->disabled()
                        ->dehydrated(false),
                    Select::make('user_id')
                        ->relationship('user', 'name')
                        ->label('Zgłaszający')
                        ->searchable()
                        ->preload(),
                    TextInput::make('subject')
                        ->label('Temat zgłoszenia')
                        ->required()
                        ->maxLength(255),
                    Select::make('category')
                        ->label('Kategoria')
                        ->options([
                            'TECH' => 'Pomoc techniczna (player / logowanie)',
                            'GENERAL' => 'Sprawy organizacyjne i terminy UDT',
                            'BILLING' => 'Faktury i płatności',
                        ])
                        ->required()
                        ->default('GENERAL'),
                    Select::make('status')
                        ->label('Status zgłoszenia')
                        ->options([
                            'OPEN' => 'Otwarte',
                            'IN_PROGRESS' => 'W trakcie wyjaśniania',
                            'CLOSED' => 'Zamknięte',
                        ])
                        ->required()
                        ->default('OPEN'),
                ])
                ->columnSpanFull(),
            Section::make('Historia wiadomości w zgłoszeniu')
                ->schema([
                    Repeater::make('messages')
                        ->relationship('messages')
                        ->label('Wiadomości i odpowiedzi biura')
                        ->schema([
                            TextInput::make('sender_name')
                                ->label('Nadawca')
                                ->default('Biuro MultiSerwis Kutno'),
                            Textarea::make('content')
                                ->label('Treść wiadomości')
                                ->rows(3)
                                ->required(),
                            Toggle::make('is_internal')
                                ->label('Notatka wewnętrzna (niewidoczna dla kursanta)')
                                ->default(false),
                        ]),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('ticket_number')
                    ->label('Numer')
                    ->weight('bold')
                    ->searchable(),
                TextColumn::make('subject')
                    ->label('Temat')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('user.name')
                    ->label('Kursant'),
                TextColumn::make('category')
                    ->label('Kategoria')
                    ->badge(),
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
                        'OPEN' => 'Otwarte',
                        'IN_PROGRESS' => 'W trakcie',
                        'CLOSED' => 'Zamknięte',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTickets::route('/'),
            'edit' => EditTicket::route('/{record}/edit'),
        ];
    }
}

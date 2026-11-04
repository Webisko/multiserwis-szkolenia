<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderStatusJsonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'publicToken' => $this->public_token,
            'orderNumber' => $this->order_number,
            'courseName' => $this->course_name,
            'amountGross' => (float) $this->amount_gross,
            'currency' => $this->currency,
            'status' => $this->status,
            'paidAt' => $this->paid_at?->toIso8601String(),
        ];
    }
}

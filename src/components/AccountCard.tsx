
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Account } from "../types";

interface AccountCardProps {
  account: Account;
  isSelected: boolean;
  onClick: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  isSelected,
  onClick,
}) => {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-blue-500 border-2" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{account.name}</span>
          {account.isParentAccount ? (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Parent</span>
          ) : (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Child</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold pb-2">${account.balance.toFixed(2)}</div>
        <div className="text-xs text-gray-500">
          Created: {new Date(account.createdAt).toLocaleDateString()}
        </div>
        
        {isSelected && (
          <Button variant="outline" className="mt-4 w-full" size="sm">
            View Transactions
          </Button>
        )}
      </CardContent>
    </Card>
  );
};


import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AccountCard } from "../components/AccountCard";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, accounts, selectedAccount, selectAccount } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {user.username}!
          </p>
        </div>
        {user.role === "parent" && (
          <Button className="mt-4 sm:mt-0">Create Child Account</Button>
        )}
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {accounts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {accounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      isSelected={selectedAccount?.id === account.id}
                      onClick={() => selectAccount(account.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No accounts found</p>
                  <Button variant="outline" className="mt-4">
                    Create Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedAccount && (
            <Card>
              <CardHeader>
                <CardTitle>Account Summary: {selectedAccount.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm font-medium text-gray-500">Current Balance</div>
                    <div className="text-2xl font-bold">${selectedAccount.balance.toFixed(2)}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm font-medium text-gray-500">Account Type</div>
                    <div className="text-lg font-medium">
                      {selectedAccount.isParentAccount ? "Parent" : "Child"}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm font-medium text-gray-500">Created On</div>
                    <div className="text-lg font-medium">
                      {new Date(selectedAccount.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedAccount
                  ? `Transactions for ${selectedAccount.name}`
                  : "Transactions"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions found</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

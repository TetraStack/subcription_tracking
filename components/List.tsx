import { Calendar } from 'react-native-calendars';
import { View, Text, ScrollView } from 'react-native';
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { subscriptions } from '~/data/data';
import dayjs from 'dayjs';

const List = () => {
    const [value, setValue] = useState('List');

    const getDaysRemaining = (date: string) => {
        const now = dayjs();
        const target = dayjs(date);
        const diff = target.diff(now, 'day');

        if (diff < 0) return { label: 'Overdue', isDue: true };
        if (diff === 0) return { label: 'Due today', isDue: true };
        return { label: `Due in ${diff} day${diff > 1 ? 's' : ''}`, isDue: false };
    };

    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};

        subscriptions.forEach((sub) => {
            const date = dayjs(sub.subscription_date).format('YYYY-MM-DD');
            const { isDue } = getDaysRemaining(sub.subscription_date);

            marks[date] = {
                marked: true,
                dotColor: isDue ? 'red' : '#007AFF',
                customStyles: {
                    container: {
                        backgroundColor: isDue ? '#ffe5e5' : '#e6f0ff',
                    },
                    text: {
                        color: isDue ? '#cc0000' : '#004080',
                        fontWeight: 'bold',
                    },
                },
            };
        });

        return marks;
    }, [subscriptions]);

    return (
        <View className='flex justify-center p-6'>
            <Text className='text-2xl font-semibold pb-3'>Upcoming</Text>
            <Tabs value={value} onValueChange={setValue} className='w-[350px]'>
                <TabsList className='flex-row w-full'>
                    <TabsTrigger value='List' className='flex-1'>
                        <Text>List</Text>
                    </TabsTrigger>
                    <TabsTrigger value='Calendar' className='flex-1'>
                        <Text>Calendar</Text>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='List'>
                    <ScrollView className="h-[500px]">
                        {subscriptions.map((subscription) => {
                            const { label, isDue } = getDaysRemaining(subscription.subscription_date);

                            return (
                                <View
                                    key={subscription.subscription_id}
                                    className="flex-row justify-between items-center border-b border-gray-300 py-3"
                                >
                                    <View>
                                        <Text className="text-base font-medium">
                                            {subscription.subscription_name}
                                        </Text>
                                        <Text className={`text-sm ${isDue ? 'text-red-500' : 'text-gray-500'}`}>
                                            {label}
                                        </Text>
                                    </View>
                                    <Text className="text-base font-semibold text-gray-800">
                                        ${subscription.subscription_amount.toFixed(2)}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </TabsContent>

                <TabsContent value='Calendar'>
                    <Calendar
                        markingType={'custom'}
                        markedDates={markedDates}
                        theme={{
                            backgroundColor: '#fff',
                            calendarBackground: '#fff',
                            textSectionTitleColor: '#888',
                            dayTextColor: '#000',
                            monthTextColor: '#000',
                            selectedDayBackgroundColor: '#007AFF',
                            todayTextColor: '#007AFF',
                            arrowColor: '#007AFF',
                            textDisabledColor: '#ccc',
                            dotColor: '#007AFF',
                            selectedDotColor: '#ffffff',
                            textDayFontWeight: '400',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '500',
                            textDayFontSize: 14,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 12,
                        }}
                    />
                </TabsContent>
            </Tabs>
        </View>
    );
};

export default List;

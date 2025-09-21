Q). How did you design the ID so it’s always the same for the same input?

=> The motive was to design the ID such that it wil remain same on giving the same input the most appropriate thing that comes in my mind is using hashing algorithm since the one thing about the hashing is depends upon the input and will create the same fix length hash on giving the same input.
To use this functionality i have used crypto(core module) and used the algoritm 'sha256' and digest is 'hex'.That's how i implemented this feature.

Q). Why did you use an event log instead of updating the record directly?

=> There are the few reasons to use the event log insetead of updating the record directly, some of them are as:

1. Having the event log makes the record more maintainable and easy to interpret.
2. One record can have multiple events associated with it so it could be messier if we update the record directly instead of using event log.
3. Event log enables handling the event seperately insetead of trying to update the record hence more modular and seperation of concern design.

Q). If two people tried to retire the same credit at the same time, what would break?
How would you fix it?

=> If two people tried to retire the same credit at the same time, it would give you the error like that record has already retired because it should be unique per the record_id so that would break the normal flow of the application to fix that i have created the event record in which i refrenced the user id such that each event is marked per user rather than event itself its fixes the issue of the two people trying to retire the same credit since now each user can do that seperately without breaking the application.

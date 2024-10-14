const FollowRequest = require("../models/followRequestSchema")
const User = require("../models/userSchema")

const sendFollowrequest = async (req, res) => {
    try {
        const recipientId = req.params.id
        const requesterId = req.payload.userId

        if(!recipientId){
            return res.status(400).json({message: "Recipient ID is required."})
        }
        const existingRequest = await FollowRequest.findOne({
            requester: requesterId,
            recipient: recipientId,
            status: "pending"
        })

        if(existingRequest){
            return res.status(400).json({message: "You have already sent a follow request to this user."})
        }
        const followRequest = new FollowRequest({
            requester: requesterId,
            recipient: recipientId,
        })
        await followRequest.save()
        return res.status(200).json({
            message: 'Follow request sent successfully',
            followRequest
        });
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while sending the follow request',
            error
        });
    }
}

const acceptFollowRequest = async (req, res) => {
    try {
        const {requestId} = req.body

        const followRequest = await FollowRequest.findById(requestId)

        if(!followRequest){
            return res.status(404).json({ message: 'Follow request not found' });
        }

        if(followRequest.status !== "pending"){
            return res.status(400).json({ message: 'Follow request is not pending' })
        } 
        followRequest.status = "accepted"
        await followRequest.save()
        const recipient = await User.findById(followRequest.recipient);
        recipient.followers.push(followRequest.requester);
        await recipient.save();
        return res.status(200).json({
            message: 'Follow request accepted',
            followRequest
        });
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while accepting the follow request',
            error
        });
    }
}

const rejectFollowRequest = async (req, res) => {
    try {
        const { requestId } = req.body; 

        const followRequest = await FollowRequest.findById(requestId);

        if (!followRequest) {
            return res.status(404).json({ message: 'Follow request not found' });
        }

        if (followRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Follow request is not pending' });
        }

        followRequest.status = 'rejected';
        await followRequest.save();

        return res.status(200).json({
            message: 'Follow request rejected',
            followRequest
        });
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while accepting the follow request',
            error
        });
    }
}

const getFollowRequests = async (req, res) => {
    try {
        const userId = req.payload.userId;
        const followRequests = await FollowRequest.find({
            recipient:userId,
            status:"pending"
        }).populate("requester", "userName imgProfile")
        if(!followRequests || followRequests.length === 0){
            return res.status(200).json({ message: 'No follow requests found' })
        }
        return res.status(200).json({
            message: 'Follow requests retrieved successfully',
            followRequests: followRequests
        });
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while retrieving follow requests',
            error
        });
    }
}

module.exports = {sendFollowrequest, rejectFollowRequest, acceptFollowRequest, getFollowRequests}
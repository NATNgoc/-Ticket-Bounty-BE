interface BaseService {
    findOneByResourceIdAndUserId(srcid: string, userId: string): Promise<any>;
}
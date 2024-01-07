import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { PipelineStage } from "mongoose";

class BasePagination {
  /**
   allowsAll means the current query allows to read all the matched data from the database.
   
   The query is allowed to read all, but if the query has the pagination, it will work following the pagination and there is no maximum limit.

   The query is allowed to read all, but if the query has the only page, limit will be default limit 
   
   The query is allowed to read all, but if the query has the only limit, page will be default page and there is no max limit 

   If not allowsAll, the query needs the pagination of page and limit. If the limit is over max limit, it will reset with max limit. 

   But if not allows all and the query doesn't have the pagination, default pagination will work
   
   The query isn't allowed to read all, but if the query has the only page, limit will be default limit 
   
   The query isn't allowed to read all, but if the query has the only limit, page will be default page and don't must be over the limit
   */
  allowsAll: boolean = false;
  maxLimit: number = 30;

  protected defaultPage = 1;
  protected defaultLimit = 10;
}

export class PaginationDto extends BasePagination {
  @IsOptional()
  @Transform((param) => parseInt(param.value))
  @IsNumber()
  @ApiProperty({ default: 1, type: Number })
  page: number | undefined;

  @IsOptional()
  @Transform((param) => parseInt(param.value))
  @IsNumber()
  @ApiProperty({ default: 10, type: Number })
  limit: number | null;

  @Expose()
  process() {
    if (this.page != undefined && this.limit != undefined) {
      /*
        Page and limit are defined
        Don't need to change the limit if the limit are not over max limit
        */
      if (!this.allowsAll && this.limit > this.maxLimit) {
        // Don't allowsAll and then Page and limit are defined, and over maxLimit
        this.limit = this.maxLimit;
      } else {
        /**
         If allows all the query, there is no maximum limit. 
         Client defined limit is the maximum limit or
         if client didn't define limit, the query will export all
         */
      }
      this.allowsAll = false;
    } else if (this.page == undefined && this.limit == undefined) {
      if (this.allowsAll) {
        // Page and limit are undefined, and allowsAll
        // Process with default
      } else {
        //  Page and limit are undefined, and not allowsAll
        this.page = this.defaultPage;
        this.limit = this.defaultLimit;
      }
    } else {
      if (this.limit != undefined) {
        if (!this.allowsAll && this.limit > this.maxLimit) {
          // Don't allowsAll and then Page is undefined and then limit is defined, and over maxLimit
          this.limit = this.maxLimit;
        }
      } else {
        this.limit = this.defaultLimit;
      }

      if (this.page == undefined) {
        // Page is undefined and then limit is defined
        this.page = this.defaultPage;
      }

      // Page is defined and then limit is undefined
      this.allowsAll = false;
    }
  }

  @Expose()
  paginationAggregate(): PipelineStage.FacetPipelineStage[] {
    try {
      return this.allowsAll
        ? []
        : [
            {
              $skip: this.limit! * (this.page! - 1),
            },
            { $limit: this.limit! },
          ];
    } catch (e) {
      throw new Error("Pagination error");
    }
  }
}
